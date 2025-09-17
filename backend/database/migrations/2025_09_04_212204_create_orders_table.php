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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('numero_pedido')->unique();
            $table->foreignId('activity_id')->constrained('activities')->onDelete('cascade');
            $table->string('email_cliente');
            $table->string('nombre_cliente');
            $table->string('telefono_cliente');
            $table->text('direccion_cliente');
            $table->string('cedula_ruc');
            $table->integer('cantidad_boletos');
            $table->decimal('total_pagado', 8, 2);
            $table->enum('metodo_pago', ['transferencia', 'deposito']);
            $table->enum('estado', ['pendiente', 'pagado', 'cancelado'])->default('pendiente');
            $table->timestamp('fecha_limite_pago');
            $table->json('numeros_boletos')->nullable();
            $table->text('notas_admin')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
