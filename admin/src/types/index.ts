// Admin Types for Next Go

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  created_at: string;
  last_login?: string;
}

export interface DashboardStats {
  total_activities: number;
  active_activities: number;
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  total_users: number;
  activities_completed_today: number;
  revenue_today: number;
}

export interface ActivityFormData {
  nombre: string;
  descripcion: string;
  imagen_url: string;
  precio_boleto: number;
  total_boletos: number;
  actividad_numero: string;
  fecha_inicio: string;
  fecha_fin: string;
  sorteo_automatico: boolean;
  cantidad_numeros_suerte: number;
  numeros_premiados?: string[];
}

export interface OrderUpdate {
  estado: 'pendiente' | 'pagado' | 'cancelado';
  notas_admin?: string;
}

export interface WinnerData {
  rifa_id: number;
  orden_id: number;
  numero_ganador: string;
  es_numero_premiado: boolean;
  fecha_sorteo: string;
  anunciado_en_instagram: boolean;
}

export interface BankAccount {
  id?: number;
  banco: string;
  tipo_cuenta: 'corriente' | 'ahorros';
  numero_cuenta: string;
  titular: string;
  cedula_ruc: string;
  email_contacto: string;
  activa: boolean;
}

export interface AdminSettings {
  whatsapp_number: string;
  support_email: string;
  company_name: string;
  company_ruc: string;
  instagram_handle: string;
  tiktok_handle: string;
  payment_deadline_hours: number;
  auto_draw_enabled: boolean;
}

// Frontend types (imported from main project)
export interface Rifa {
  id: number;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  precio_boleto: string | number;
  total_boletos: number;
  boletos_vendidos: number;
  actividad_numero: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'activa' | 'sorteo_en_curso' | 'finalizada' | 'cancelada';
  porcentaje_vendido: string | number;
  sorteo_automatico: boolean;
  cantidad_numeros_suerte: number;
  numeros_premiados?: string[];
}

export interface Orden {
  id: number;
  numero_pedido: string;
  rifa_id: number;
  email_cliente: string;
  nombre_cliente: string;
  telefono_cliente: string;
  direccion_cliente: string;
  cedula_ruc: string;
  cantidad_boletos: number;
  total_pagado: string | number;
  metodo_pago: 'transferencia' | 'deposito';
  estado: 'pendiente' | 'pagado' | 'cancelado';
  fecha_limite_pago: string;
  numeros_boletos?: string[];
  created_at: string;
  updated_at: string;
}