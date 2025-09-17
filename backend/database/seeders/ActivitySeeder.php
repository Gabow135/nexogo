<?php

namespace Database\Seeders;

use App\Models\Activity;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $activity1 = Activity::create([
            'nombre' => 'iPhone 15 Pro Max 256GB',
            'descripcion' => 'El último iPhone con cámara profesional y tecnología de vanguardia',
            'imagen_url' => 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
            'precio_boleto' => 1.00,
            'total_boletos' => 1000,
            'boletos_vendidos' => 450,
            'actividad_numero' => '#35',
            'fecha_inicio' => '2024-01-01',
            'fecha_fin' => '2024-12-31',
            'estado' => 'activa',
            'porcentaje_vendido' => 45.0,
            'sorteo_automatico' => true,
            'cantidad_numeros_suerte' => 5
        ]);
        $activity1->generateLuckyNumbers();

        $activity2 = Activity::create([
            'nombre' => 'MacBook Pro M3 14"',
            'descripcion' => 'La laptop más potente de Apple con chip M3 y pantalla Retina',
            'imagen_url' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
            'precio_boleto' => 1.00,
            'total_boletos' => 800,
            'boletos_vendidos' => 800,
            'actividad_numero' => '#36',
            'fecha_inicio' => '2024-01-01',
            'fecha_fin' => '2024-12-31',
            'estado' => 'finalizada',
            'porcentaje_vendido' => 100.0,
            'sorteo_automatico' => true,
            'cantidad_numeros_suerte' => 3
        ]);
        $activity2->generateLuckyNumbers();

        $activity3 = Activity::create([
            'nombre' => 'AirPods Pro 2',
            'descripcion' => 'Los audífonos inalámbricos más avanzados de Apple con cancelación de ruido',
            'imagen_url' => 'https://images.unsplash.com/photo-1572569511254-d8f925dc2f4d?w=400',
            'precio_boleto' => 1.00,
            'total_boletos' => 300,
            'boletos_vendidos' => 180,
            'actividad_numero' => '#37',
            'fecha_inicio' => '2024-01-01',
            'fecha_fin' => '2024-12-31',
            'estado' => 'activa',
            'porcentaje_vendido' => 60.0,
            'sorteo_automatico' => true,
            'cantidad_numeros_suerte' => 2
        ]);
        $activity3->generateLuckyNumbers();
    }
}
