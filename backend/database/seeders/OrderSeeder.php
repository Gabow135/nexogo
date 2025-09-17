<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Order::create([
            'numero_pedido' => '197605',
            'activity_id' => 1,
            'email_cliente' => 'gabriel@email.com',
            'nombre_cliente' => 'Gabriel Reyes',
            'telefono_cliente' => '0955466833',
            'direccion_cliente' => 'Av Ciceron y Wistong Churchill, Ambato, Tungurahua',
            'cedula_ruc' => '1804758934',
            'cantidad_boletos' => 6,
            'total_pagado' => 6.00,
            'metodo_pago' => 'transferencia',
            'estado' => 'pendiente',
            'fecha_limite_pago' => now()->addHours(20),
        ]);

        \App\Models\Order::create([
            'numero_pedido' => '197606',
            'activity_id' => 2,
            'email_cliente' => 'maria@email.com',
            'nombre_cliente' => 'María López',
            'telefono_cliente' => '0987654321',
            'direccion_cliente' => 'Calle 10 de Agosto, Quito, Pichincha',
            'cedula_ruc' => '1785432109',
            'cantidad_boletos' => 12,
            'total_pagado' => 12.00,
            'metodo_pago' => 'deposito',
            'estado' => 'pagado',
            'fecha_limite_pago' => now()->addHours(22),
        ]);

        \App\Models\Order::create([
            'numero_pedido' => '197607',
            'activity_id' => 1,
            'email_cliente' => 'carlos@email.com',
            'nombre_cliente' => 'Carlos Mendoza',
            'telefono_cliente' => '0998877665',
            'direccion_cliente' => 'Av. Amazonas 123, Quito, Pichincha',
            'cedula_ruc' => '1712345678',
            'cantidad_boletos' => 8,
            'total_pagado' => 8.00,
            'metodo_pago' => 'transferencia',
            'estado' => 'cancelado',
            'fecha_limite_pago' => now()->subHours(2),
        ]);

        \App\Models\Order::create([
            'numero_pedido' => '197608',
            'activity_id' => 1,
            'email_cliente' => 'ana@email.com',
            'nombre_cliente' => 'Ana Torres',
            'telefono_cliente' => '0999123456',
            'direccion_cliente' => 'Calle Sucre 456, Cuenca, Azuay',
            'cedula_ruc' => '0123456789',
            'cantidad_boletos' => 5,
            'total_pagado' => 5.00,
            'metodo_pago' => 'deposito',
            'estado' => 'pendiente',
            'fecha_limite_pago' => now()->addHours(18),
        ]);
    }
}
