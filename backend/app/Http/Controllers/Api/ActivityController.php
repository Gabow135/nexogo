<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource (Admin).
     */
    public function index()
    {
        $activities = Activity::with(['orders', 'winners', 'winners.order'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($activity) {
                $mainWinner = $activity->mainWinner();
                
                return array_merge($activity->toArray(), [
                    'main_winner' => $mainWinner ? [
                        'id' => $mainWinner->id,
                        'numero_ganador' => $mainWinner->numero_ganador,
                        'winner_name' => $mainWinner->order ? $mainWinner->order->nombre_cliente : 'N/A',
                        'fecha_sorteo' => $mainWinner->fecha_sorteo,
                        'anunciado_en_instagram' => $mainWinner->anunciado_en_instagram
                    ] : null
                ]);
            });

        return response()->json($activities);
    }

    /**
     * Display a listing of active activities (Public).
     */
    public function publicIndex()
    {
        $activities = Activity::with(['winners.order'])
            ->whereIn('estado', ['activa', 'sorteo_en_curso', 'finalizada'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($activity) {
                $mainWinner = $activity->mainWinner();
                
                return array_merge($activity->toArray(), [
                    'main_winner' => $mainWinner ? [
                        'numero_ganador' => $mainWinner->numero_ganador,
                        'winner_name' => $mainWinner->order ? $mainWinner->order->nombre_cliente : 'N/A',
                        'fecha_sorteo' => $mainWinner->fecha_sorteo,
                        'anunciado_en_instagram' => $mainWinner->anunciado_en_instagram
                    ] : null
                ]);
            });

        return response()->json($activities);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'imagen_url' => 'required|url',
            'precio_boleto' => 'required|numeric|min:0.01',
            'total_boletos' => 'required|integer|min:1',
            'actividad_numero' => 'nullable|string|unique:activities,actividad_numero',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'sorteo_automatico' => 'boolean',
            'cantidad_numeros_suerte' => 'required|integer|min:1|max:20',
            'numeros_premiados' => 'array'
        ]);

        // Auto-generate activity number if not provided
        if (empty($request->actividad_numero)) {
            $lastActivity = Activity::orderBy('id', 'desc')->first();
            $nextNumber = $lastActivity ? $lastActivity->id + 1 : 1;
            $request->merge(['actividad_numero' => (string)$nextNumber]);
        }

        $activity = Activity::create($request->all());
        
        // Generar números de suerte automáticamente si no se proporcionaron
        if (empty($request->numeros_premiados)) {
            $activity->generateLuckyNumbers();
        }

        return response()->json([
            'message' => 'Actividad creada exitosamente',
            'activity' => $activity
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $activity = Activity::with(['orders', 'winners'])->findOrFail($id);
        return response()->json($activity);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $activity = Activity::findOrFail($id);

        $request->validate([
            'nombre' => 'string|max:255',
            'descripcion' => 'string',
            'imagen_url' => 'url',
            'precio_boleto' => 'numeric|min:0.01',
            'total_boletos' => 'integer|min:1',
            'actividad_numero' => 'string|unique:activities,actividad_numero,' . $activity->id,
            'fecha_inicio' => 'date',
            'fecha_fin' => 'date|after:fecha_inicio',
            'estado' => 'in:activa,sorteo_en_curso,finalizada,cancelada',
            'sorteo_automatico' => 'boolean',
            'cantidad_numeros_suerte' => 'integer|min:1|max:20',
            'numeros_premiados' => 'array'
        ]);

        $oldCantidadNumeros = $activity->cantidad_numeros_suerte;
        $activity->update($request->all());

        // Recalcular porcentaje si se actualizaron boletos
        if ($request->has(['boletos_vendidos', 'total_boletos'])) {
            $activity->updatePercentage();
        }

        // Regenerar números de suerte si cambió la cantidad
        if ($request->has('cantidad_numeros_suerte') && $request->cantidad_numeros_suerte != $oldCantidadNumeros) {
            $activity->generateLuckyNumbers();
        }

        return response()->json([
            'message' => 'Actividad actualizada exitosamente',
            'activity' => $activity
        ]);
    }

    /**
     * Assign winner to specific lucky number.
     */
    public function assignWinner(Request $request, string $id)
    {
        $activity = Activity::findOrFail($id);
        
        $request->validate([
            'numero_ganador' => 'required|string',
            'order_id' => 'required|exists:orders,id',
            'notas' => 'nullable|string'
        ]);

        // Verificar que el número esté en la lista de números premiados
        if (!in_array($request->numero_ganador, $activity->numeros_premiados ?? [])) {
            return response()->json([
                'error' => 'El número especificado no está en la lista de números premiados'
            ], 422);
        }

        // Verificar que no exista ya un ganador para este número
        $existingWinner = \App\Models\Winner::where('activity_id', $activity->id)
            ->where('numero_ganador', $request->numero_ganador)
            ->first();

        if ($existingWinner) {
            return response()->json([
                'error' => 'Ya existe un ganador asignado para este número'
            ], 422);
        }

        // Crear el ganador
        $winner = \App\Models\Winner::create([
            'activity_id' => $activity->id,
            'order_id' => $request->order_id,
            'numero_ganador' => $request->numero_ganador,
            'es_numero_premiado' => true,
            'fecha_sorteo' => now(),
            'anunciado_en_instagram' => false,
            'notas' => $request->notas
        ]);

        return response()->json([
            'message' => 'Ganador asignado exitosamente',
            'winner' => $winner->load(['order', 'activity'])
        ]);
    }

    /**
     * Execute automatic raffle - scan all paid orders for winning numbers
     */
    public function executeAutomaticRaffle(string $id)
    {
        $activity = Activity::findOrFail($id);
        
        if (!$activity->numeros_premiados || count($activity->numeros_premiados) === 0) {
            return response()->json([
                'error' => 'Esta actividad no tiene números premiados generados'
            ], 422);
        }
        
        // Obtener todas las órdenes pagadas de esta actividad
        $paidOrders = \App\Models\Order::where('activity_id', $activity->id)
            ->where('estado', 'pagado')
            ->whereNotNull('numeros_boletos')
            ->get();
        
        $totalWinnersAssigned = 0;
        $winnerDetails = [];
        
        // First, assign winners for lucky numbers
        foreach ($paidOrders as $order) {
            $winningNumbers = $order->autoAssignWinner();
            if (!empty($winningNumbers)) {
                $totalWinnersAssigned += count($winningNumbers);
                $winnerDetails[] = [
                    'order_id' => $order->id,
                    'cliente' => $order->nombre_cliente,
                    'winning_numbers' => $winningNumbers,
                    'type' => 'lucky_numbers'
                ];
            }
        }

        // Then, generate main winner from all sold numbers
        $mainWinner = $this->generateWinnerFromSoldNumbers($activity);
        if ($mainWinner) {
            $totalWinnersAssigned++;
            $winnerDetails[] = [
                'order_id' => $mainWinner->order_id,
                'cliente' => $mainWinner->order->nombre_cliente,
                'winning_numbers' => [$mainWinner->numero_ganador],
                'type' => 'main_winner'
            ];
        }
        
        return response()->json([
            'message' => $totalWinnersAssigned > 0 
                ? "Sorteo automático ejecutado. {$totalWinnersAssigned} ganador(es) asignado(s)."
                : "Sorteo ejecutado pero no se encontraron ganadores en las órdenes actuales.",
            'winners_assigned' => $totalWinnersAssigned,
            'winner_details' => $winnerDetails,
            'main_winner' => $mainWinner
        ]);
    }

    /**
     * Get winners by lucky number for activity.
     */
    public function getWinnersByNumber(string $id)
    {
        $activity = Activity::with(['winners.order'])->findOrFail($id);
        
        // Organizar ganadores por número
        $winnersByNumber = [];
        foreach ($activity->numeros_premiados ?? [] as $numero) {
            $winner = $activity->winners->where('numero_ganador', $numero)->first();
            $winnersByNumber[] = [
                'numero' => $numero,
                'winner' => $winner,
                'order' => $winner ? $winner->order : null
            ];
        }

        return response()->json([
            'activity' => $activity,
            'winners_by_number' => $winnersByNumber
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $activity = Activity::findOrFail($id);
        
        if ($activity->orders()->count() > 0) {
            throw ValidationException::withMessages([
                'activity' => ['No se puede eliminar una actividad que tiene órdenes asociadas.']
            ]);
        }

        $activity->delete();

        return response()->json([
            'message' => 'Actividad eliminada exitosamente'
        ]);
    }

    /**
     * Realizar sorteo de una actividad.
     */
    public function draw(Request $request, Activity $activity)
    {
        if ($activity->estado !== 'activa') {
            throw ValidationException::withMessages([
                'activity' => ['Solo se pueden sortear actividades activas.']
            ]);
        }

        if ($activity->porcentaje_vendido < 100) {
            throw ValidationException::withMessages([
                'activity' => ['La actividad debe estar al 100% para ser sorteada.']
            ]);
        }

        // Cambiar estado a sorteo en curso
        $activity->update(['estado' => 'sorteo_en_curso']);
        
        // Ejecutar sorteo automático
        $this->executeAutomaticRaffle($activity->id);

        return response()->json([
            'message' => 'Sorteo realizado exitosamente',
            'activity' => $activity->fresh()
        ]);
    }

    /**
     * Generate single winner from sold numbers when activity reaches 100%.
     */
    public function generateWinnerFromSoldNumbers(Activity $activity)
    {
        // Check if a main winner already exists
        $existingMainWinner = $activity->winners()->where('es_numero_premiado', false)->first();
        if ($existingMainWinner) {
            return $existingMainWinner;
        }

        // Get all paid orders for this activity
        $paidOrders = \App\Models\Order::where('activity_id', $activity->id)
            ->where('estado', 'pagado')
            ->whereNotNull('numeros_boletos')
            ->get();

        if ($paidOrders->isEmpty()) {
            return null;
        }

        // Collect all sold ticket numbers
        $allSoldNumbers = [];
        foreach ($paidOrders as $order) {
            $orderNumbers = is_string($order->numeros_boletos) 
                ? json_decode($order->numeros_boletos, true) 
                : $order->numeros_boletos;
                
            if (is_array($orderNumbers)) {
                $allSoldNumbers = array_merge($allSoldNumbers, $orderNumbers);
            }
        }

        if (empty($allSoldNumbers)) {
            return null;
        }

        // Randomly select a winning number from all sold numbers
        $winningNumber = $allSoldNumbers[array_rand($allSoldNumbers)];
        
        // Find the order that contains this winning number
        $winningOrder = null;
        foreach ($paidOrders as $order) {
            $orderNumbers = is_string($order->numeros_boletos) 
                ? json_decode($order->numeros_boletos, true) 
                : $order->numeros_boletos;
                
            if (is_array($orderNumbers) && in_array($winningNumber, $orderNumbers)) {
                $winningOrder = $order;
                break;
            }
        }

        if (!$winningOrder) {
            return null;
        }

        // Create the winner record
        $winner = \App\Models\Winner::create([
            'activity_id' => $activity->id,
            'order_id' => $winningOrder->id,
            'numero_ganador' => $winningNumber,
            'es_numero_premiado' => false, // This is the main winner, not a lucky number
            'fecha_sorteo' => now(),
            'anunciado_en_instagram' => false,
            'notas' => 'Ganador principal del sorteo - Número seleccionado de todos los boletos vendidos'
        ]);

        // Update activity status to 'finalizada' when main winner is assigned
        $activity->update(['estado' => 'finalizada']);

        return $winner;
    }

    /**
     * Manually assign main winner to an activity
     */
    public function assignMainWinner(string $id)
    {
        $activity = Activity::findOrFail($id);
        
        // Check if main winner already exists
        $existingMainWinner = $activity->winners()->where('es_numero_premiado', false)->first();
        if ($existingMainWinner) {
            return response()->json([
                'message' => 'Esta actividad ya tiene un ganador principal asignado',
                'main_winner' => $existingMainWinner->load(['activity', 'order'])
            ]);
        }

        // Generate main winner
        $mainWinner = $this->generateWinnerFromSoldNumbers($activity);
        
        if (!$mainWinner) {
            return response()->json([
                'error' => 'No se pudo generar un ganador principal. Verifique que haya órdenes pagadas.'
            ], 422);
        }

        return response()->json([
            'message' => 'Ganador principal asignado exitosamente',
            'main_winner' => $mainWinner->load(['activity', 'order'])
        ]);
    }

    /**
     * Mark activity as finished if it has a main winner
     */
    public function markAsFinished(string $id)
    {
        $activity = Activity::findOrFail($id);
        
        // Check if activity has a main winner
        $mainWinner = $activity->winners()->where('es_numero_premiado', false)->first();
        if (!$mainWinner) {
            return response()->json([
                'error' => 'Esta actividad no tiene un ganador principal asignado'
            ], 422);
        }

        // Update status to 'finalizada'
        $activity->update(['estado' => 'finalizada']);

        // Automatically mark the main winner as announced on Instagram
        $mainWinner->update(['anunciado_en_instagram' => true]);

        return response()->json([
            'message' => 'Actividad marcada como finalizada exitosamente y ganador anunciado',
            'activity' => $activity->load(['winners.order'])
        ]);
    }
}
