<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'numero_pedido',
        'activity_id',
        'email_cliente',
        'nombre_cliente',
        'telefono_cliente',
        'direccion_cliente',
        'cedula_ruc',
        'cantidad_boletos',
        'total_pagado',
        'metodo_pago',
        'estado',
        'fecha_limite_pago',
        'numeros_boletos',
        'notas_admin'
    ];

    protected $casts = [
        'total_pagado' => 'decimal:2',
        'fecha_limite_pago' => 'datetime',
        'numeros_boletos' => 'array'
    ];

    protected $appends = ['rifa_id'];

    public function getRifaIdAttribute()
    {
        return $this->activity_id;
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function winner()
    {
        return $this->hasOne(Winner::class);
    }

    // Generar número de pedido único
    public static function generateOrderNumber()
    {
        do {
            $number = str_pad(mt_rand(100000, 999999), 6, '0', STR_PAD_LEFT);
        } while (self::where('numero_pedido', $number)->exists());
        
        return $number;
    }

    // Generar números de boleto únicos para esta orden
    public function generateTicketNumbers()
    {
        $activity = $this->activity;
        $ticketNumbers = [];
        $existingNumbers = $this->getExistingTicketNumbers($activity->id);
        
        // Generar números únicos para la cantidad de boletos comprados
        while (count($ticketNumbers) < $this->cantidad_boletos) {
            $number = str_pad(mt_rand(1, $activity->total_boletos), 5, '0', STR_PAD_LEFT);
            
            // Verificar que no esté duplicado ni en uso
            if (!in_array($number, $ticketNumbers) && !in_array($number, $existingNumbers)) {
                $ticketNumbers[] = $number;
            }
        }
        
        sort($ticketNumbers);
        $this->numeros_boletos = $ticketNumbers;
        $this->save();
        
        return $ticketNumbers;
    }

    // Obtener todos los números de boleto ya asignados para una actividad
    private function getExistingTicketNumbers($activityId)
    {
        return self::where('activity_id', $activityId)
            ->where('estado', 'pagado')
            ->whereNotNull('numeros_boletos')
            ->pluck('numeros_boletos')
            ->flatten()
            ->toArray();
    }

    // Verificar si esta orden tiene números ganadores
    public function checkWinningNumbers()
    {
        $activity = $this->activity;
        
        // Solo verificar si la orden está pagada y tiene números asignados
        if ($this->estado !== 'pagado' || !$this->numeros_boletos || !$activity->numeros_premiados) {
            return [];
        }

        $winningNumbers = [];
        
        foreach ($this->numeros_boletos as $ticketNumber) {
            if (in_array($ticketNumber, $activity->numeros_premiados)) {
                $winningNumbers[] = $ticketNumber;
            }
        }
        
        return $winningNumbers;
    }

    // Asignar automáticamente como ganador si tiene números premiados
    public function autoAssignWinner()
    {
        $winningNumbers = $this->checkWinningNumbers();
        
        if (!empty($winningNumbers)) {
            // Crear o actualizar entrada de ganador por cada número ganador
            foreach ($winningNumbers as $winningNumber) {
                // Verificar si ya existe un ganador para este número
                $existingWinner = Winner::where('activity_id', $this->activity_id)
                    ->where('numero_ganador', $winningNumber)
                    ->first();
                
                if (!$existingWinner) {
                    Winner::create([
                        'activity_id' => $this->activity_id,
                        'order_id' => $this->id,
                        'numero_ganador' => $winningNumber,
                        'es_numero_premiado' => true,
                        'fecha_sorteo' => now(),
                        'anunciado_en_instagram' => false,
                        'notas' => 'Ganador asignado automáticamente al confirmar pago'
                    ]);
                }
            }
            
            return $winningNumbers;
        }
        
        return [];
    }
}
