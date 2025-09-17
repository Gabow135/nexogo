<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\BankAccount;

class BankAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $bankAccounts = [
            [
                'banco' => 'Banco Pichincha',
                'tipo_cuenta' => 'corriente',
                'numero_cuenta' => '2100335322',
                'titular' => 'Corporación Flores',
                'cedula_ruc' => '1793227012001',
                'email_contacto' => 'info@proyectosflores.com',
                'activa' => true,
            ],
            [
                'banco' => 'Banco Guayaquil',
                'tipo_cuenta' => 'ahorros',
                'numero_cuenta' => '0016481470',
                'titular' => 'Adrián Flores',
                'cedula_ruc' => '0105071146',
                'email_contacto' => 'info@proyectosflores.com',
                'activa' => true,
            ],
            [
                'banco' => 'Jardín Azuayo',
                'tipo_cuenta' => 'ahorros',
                'numero_cuenta' => '2821454',
                'titular' => 'Corporación Flores',
                'cedula_ruc' => '1793227012001',
                'email_contacto' => 'info@proyectosflores.com',
                'activa' => true,
            ],
        ];

        foreach ($bankAccounts as $account) {
            BankAccount::create($account);
        }
    }
}
