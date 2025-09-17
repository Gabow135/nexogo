<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Winner extends Model
{
    protected $fillable = [
        'activity_id',
        'order_id',
        'numero_ganador',
        'es_numero_premiado',
        'fecha_sorteo',
        'anunciado_en_instagram',
        'notas'
    ];

    protected $casts = [
        'es_numero_premiado' => 'boolean',
        'anunciado_en_instagram' => 'boolean',
        'fecha_sorteo' => 'datetime'
    ];

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
