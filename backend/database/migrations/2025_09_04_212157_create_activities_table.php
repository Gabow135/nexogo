<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->text('descripcion');
            $table->string('imagen_url');
            $table->decimal('precio_boleto', 8, 2)->default(1.00);
            $table->integer('total_boletos');
            $table->integer('boletos_vendidos')->default(0);
            $table->string('actividad_numero')->unique();
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->enum('estado', ['activa', 'sorteo_en_curso', 'finalizada', 'cancelada'])->default('activa');
            $table->decimal('porcentaje_vendido', 5, 2)->default(0.00);
            $table->boolean('sorteo_automatico')->default(true);
            $table->json('numeros_premiados')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
