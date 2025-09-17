<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    protected $fillable = [
        'banco',
        'tipo_cuenta',
        'numero_cuenta',
        'titular',
        'cedula_ruc',
        'email_contacto',
        'activa'
    ];

    protected $casts = [
        'activa' => 'boolean'
    ];

    // Scope para cuentas activas
    public function scopeActive($query)
    {
        return $query->where('activa', true);
    }
}
