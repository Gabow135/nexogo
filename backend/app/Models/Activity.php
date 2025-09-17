<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'imagen_url',
        'precio_boleto',
        'total_boletos',
        'boletos_vendidos',
        'actividad_numero',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'porcentaje_vendido',
        'sorteo_automatico',
        'cantidad_numeros_suerte',
        'numeros_premiados'
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'precio_boleto' => 'decimal:2',
        'porcentaje_vendido' => 'decimal:2',
        'sorteo_automatico' => 'boolean',
        'numeros_premiados' => 'array'
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function winners()
    {
        return $this->hasMany(Winner::class);
    }

    // Get the main winner (not lucky numbers)
    public function mainWinner()
    {
        return $this->winners()->where('es_numero_premiado', false)->first();
    }

    // Get lucky number winners
    public function luckyWinners()
    {
        return $this->winners()->where('es_numero_premiado', true)->get();
    }

    // Actualizar porcentaje cuando se venden boletos
    public function updatePercentage()
    {
        $this->porcentaje_vendido = ($this->boletos_vendidos / $this->total_boletos) * 100;
        $this->save();
    }

    // Generar números de suerte aleatorios únicos
    public function generateLuckyNumbers()
    {
        $luckyNumbers = [];
        $maxNumber = $this->total_boletos;
        
        // Generar números únicos hasta alcanzar la cantidad requerida
        while (count($luckyNumbers) < $this->cantidad_numeros_suerte) {
            $number = str_pad(mt_rand(1, $maxNumber), 5, '0', STR_PAD_LEFT);
            if (!in_array($number, $luckyNumbers)) {
                $luckyNumbers[] = $number;
            }
        }
        
        sort($luckyNumbers);
        $this->numeros_premiados = $luckyNumbers;
        $this->save();
        
        return $luckyNumbers;
    }
}
