<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Activity;
use App\Mail\PaymentConfirmationMail;
use App\Mail\PaymentInstructionsMail;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    /**
     * Display a listing of orders (Admin).
     */
    public function index()
    {
        $orders = Order::with(['activity'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Store a newly created order (Public).
     */
    public function store(Request $request)
    {
        $request->validate([
            'activity_id' => 'required|exists:activities,id',
            'email_cliente' => 'required|email',
            'nombre_cliente' => 'required|string|max:255',
            'telefono_cliente' => 'required|string|max:20',
            'direccion_cliente' => 'required|string|max:500',
            'cedula_ruc' => 'required|string|max:20',
            'cantidad_boletos' => 'required|integer|min:1',
            'metodo_pago' => 'required|in:transferencia,deposito',
        ]);

        $activity = Activity::findOrFail($request->activity_id);

        // Verificar que la actividad esté activa
        if ($activity->estado !== 'activa') {
            throw ValidationException::withMessages([
                'activity' => ['Esta actividad no está disponible para nuevas órdenes.']
            ]);
        }

        // Verificar disponibilidad de boletos
        $boletosDisponibles = $activity->total_boletos - $activity->boletos_vendidos;
        if ($request->cantidad_boletos > $boletosDisponibles) {
            throw ValidationException::withMessages([
                'cantidad_boletos' => ['No hay suficientes boletos disponibles. Disponibles: ' . $boletosDisponibles]
            ]);
        }

        // Generar número de pedido único secuencial
        $lastOrder = Order::orderBy('id', 'desc')->first();
        $numeroPedido = $lastOrder ? $lastOrder->id + 1 : 1;

        // Calcular total
        $totalPagado = $activity->precio_boleto * $request->cantidad_boletos;

        // Crear la orden
        $order = Order::create([
            'numero_pedido' => $numeroPedido,
            'activity_id' => $activity->id,
            'email_cliente' => $request->email_cliente,
            'nombre_cliente' => $request->nombre_cliente,
            'telefono_cliente' => $request->telefono_cliente,
            'direccion_cliente' => $request->direccion_cliente,
            'cedula_ruc' => $request->cedula_ruc,
            'cantidad_boletos' => $request->cantidad_boletos,
            'total_pagado' => $totalPagado,
            'metodo_pago' => $request->metodo_pago,
            'estado' => 'pendiente',
            'fecha_limite_pago' => now()->addHour(), // 1 hora para pagar
        ]);

        // Enviar correo con instrucciones de pago
        try {
            Mail::to($order->email_cliente)->send(new PaymentInstructionsMail($order));
            \Log::info("Correo de instrucciones de pago enviado", [
                'order_id' => $order->id,
                'email' => $order->email_cliente
            ]);
        } catch (\Exception $e) {
            \Log::error("Error enviando correo de instrucciones de pago", [
                'order_id' => $order->id,
                'email' => $order->email_cliente,
                'error' => $e->getMessage()
            ]);
        }

        return response()->json([
            'message' => 'Orden creada exitosamente',
            'order' => $order->load('activity')
        ], 201);
    }

    /**
     * Display the specified order (Public).
     */
    public function show(string $numeroPedido)
    {
        $order = Order::with(['activity'])
            ->where('numero_pedido', $numeroPedido)
            ->firstOrFail();

        return response()->json($order);
    }

    /**
     * Update the specified order status (Admin).
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'estado' => 'required|in:pendiente,pagado,cancelado',
            'notas_admin' => 'nullable|string',
        ]);

        $oldStatus = $order->estado;
        $newStatus = $request->estado;

        $order->update([
            'estado' => $newStatus,
            'notas_admin' => $request->notas_admin,
        ]);

        // Si el estado cambió a "pagado", actualizar los boletos vendidos de la actividad
        if ($oldStatus !== 'pagado' && $newStatus === 'pagado') {
            $activity = $order->activity;
            $activity->increment('boletos_vendidos', $order->cantidad_boletos);
            $activity->updatePercentage();
            
            // Generar números de boleto automáticamente
            $order->generateTicketNumbers();
            
            // Verificar automáticamente si tiene números ganadores
            $winningNumbers = $order->autoAssignWinner();
            if (!empty($winningNumbers)) {
                \Log::info("Ganador automático asignado", [
                    'order_id' => $order->id,
                    'winning_numbers' => $winningNumbers,
                    'cliente' => $order->nombre_cliente
                ]);
            }

            // Enviar correo de confirmación de pago
            try {
                Mail::to($order->email_cliente)->send(new PaymentConfirmationMail($order));
                \Log::info("Correo de confirmación enviado", [
                    'order_id' => $order->id,
                    'email' => $order->email_cliente
                ]);
            } catch (\Exception $e) {
                \Log::error("Error enviando correo de confirmación", [
                    'order_id' => $order->id,
                    'email' => $order->email_cliente,
                    'error' => $e->getMessage()
                ]);
            }
            
            // Si se completó al 100% y tiene sorteo automático, cambiar estado
            if ($activity->porcentaje_vendido >= 100 && $activity->sorteo_automatico) {
                $activity->update(['estado' => 'sorteo_en_curso']);
            }
        }

        // Si el estado cambió de "pagado" a otro, restar los boletos
        if ($oldStatus === 'pagado' && $newStatus !== 'pagado') {
            $activity = $order->activity;
            $activity->decrement('boletos_vendidos', $order->cantidad_boletos);
            $activity->updatePercentage();
            
            // Limpiar números de boleto cuando ya no está pagado
            $order->numeros_boletos = null;
            $order->save();
        }

        return response()->json([
            'message' => 'Estado de la orden actualizado exitosamente',
            'order' => $order->fresh()->load('activity')
        ]);
    }

    /**
     * Update the specified order (Admin).
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'email_cliente' => 'email',
            'nombre_cliente' => 'string|max:255',
            'telefono_cliente' => 'string|max:20',
            'direccion_cliente' => 'string|max:500',
            'cedula_ruc' => 'string|max:20',
            'estado' => 'in:pendiente,pagado,cancelado',
            'notas_admin' => 'nullable|string',
        ]);

        $order->update($request->all());

        return response()->json([
            'message' => 'Orden actualizada exitosamente',
            'order' => $order->load('activity')
        ]);
    }

    /**
     * Search orders by email (Public).
     */
    public function searchByEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $orders = Order::with('activity')
            ->where('email_cliente', $request->email)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Remove the specified order (Admin).
     */
    public function destroy(Order $order)
    {
        // No permitir eliminar órdenes pagadas
        if ($order->estado === 'pagado') {
            throw ValidationException::withMessages([
                'order' => ['No se puede eliminar una orden que ya fue pagada.']
            ]);
        }

        $order->delete();

        return response()->json([
            'message' => 'Orden eliminada exitosamente'
        ]);
    }
}