<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear admins de demo
        Admin::create([
            'username' => 'admin',
            'email' => 'admin@nexogo.com',
            'password' => 'admin123', // Se hasheará automáticamente
            'role' => 'super_admin'
        ]);

        Admin::create([
            'username' => 'nexogo',
            'email' => 'info@nexogo.com', 
            'password' => 'nexogo2024', // Se hasheará automáticamente
            'role' => 'admin'
        ]);
    }
}
