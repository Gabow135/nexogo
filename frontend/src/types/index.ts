// Types for Next Go Raffle System

export interface Rifa {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  precio_boleto: string | number; // Backend sends as string
  total_boletos: number;
  boletos_vendidos: number;
  actividad_numero: string; // e.g., "#35"
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'activa' | 'finalizada' | 'cancelada' | 'sorteo_en_curso';
  porcentaje_vendido: string | number; // Backend sends as string
  sorteo_automatico: boolean;
  cantidad_numeros_suerte: number;
  numeros_premiados?: string[]; // Array of special winning numbers
  main_winner?: {
    id: number;
    numero_ganador: string;
    winner_name: string;
    fecha_sorteo: string;
    anunciado_en_instagram: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Orden {
  id: number;
  numero_pedido: string; // e.g., "197605"
  activity_id: number; // Backend uses activity_id instead of rifa_id
  email_cliente: string;
  nombre_cliente: string;
  telefono_cliente: string;
  direccion_cliente: string;
  cedula_ruc: string;
  cantidad_boletos: number;
  total_pagado: string | number; // Backend sends as string
  metodo_pago: 'transferencia' | 'deposito';
  estado: 'pendiente' | 'pagado' | 'cancelado';
  fecha_limite_pago: string;
  numeros_boletos?: string[]; // Backend uses numeros_boletos
  notas_admin?: string;
  activity?: Rifa; // Optional activity relation when included by backend
  created_at: string;
  updated_at: string;
}

export interface CuentaBancaria {
  id: number;
  banco: string;
  tipo_cuenta: 'corriente' | 'ahorros';
  numero_cuenta: string;
  titular: string;
  cedula_ruc: string;
  email_contacto: string;
  activa: boolean;
}

export interface NumeroBoleto {
  id: number;
  rifa_id: number;
  orden_id: number;
  numero: string; // 5 digits
  es_premiado: boolean;
  premio_descripcion?: string;
  estado: 'disponible' | 'vendido' | 'ganador';
}

export interface Ganador {
  id: number;
  rifa_id: number;
  orden_id: number;
  numero_ganador: string;
  es_numero_premiado: boolean;
  fecha_sorteo: string;
  anunciado_en_instagram: boolean;
  rifa: Rifa;
  orden: Orden;
}

export interface CompraRequest {
  rifa_id: number;
  cantidad_boletos: number;
  nombre_cliente: string;
  email_cliente: string;
  telefono_cliente: string;
  direccion_cliente: string;
  cedula_ruc: string;
  metodo_pago: 'transferencia' | 'deposito';
}

export interface ConsultaRequest {
  email: string;
  actividad_numero?: string; // Optional filter by activity
}

export interface ConsultaResponse {
  boletos: {
    rifa: Rifa;
    orden: Orden;
    numeros: string[];
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}