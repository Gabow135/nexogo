import axios from 'axios';
import {
  Rifa,
  Orden,
  CuentaBancaria,
  CompraRequest,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Activities (Public endpoints)
export const activitiesService = {
  // Get all active activities
  getAll: (): Promise<Rifa[]> =>
    api.get('/public/activities').then((res) => res.data),

  // Get specific activity details
  getById: (id: number): Promise<Rifa> =>
    api.get(`/public/activities/${id}`).then((res) => res.data),
};

// Orders/Purchases (Public endpoints)
export const ordersService = {
  // Create new order
  create: (data: CompraRequest): Promise<{ message: string; order: Orden }> =>
    api.post('/public/orders', {
      activity_id: data.rifa_id,
      cantidad_boletos: data.cantidad_boletos,
      nombre_cliente: data.nombre_cliente,
      email_cliente: data.email_cliente,
      telefono_cliente: data.telefono_cliente,
      direccion_cliente: data.direccion_cliente,
      cedula_ruc: data.cedula_ruc,
      metodo_pago: data.metodo_pago
    }).then((res) => res.data),

  // Get order by order number
  getByNumber: (numero: string): Promise<Orden> =>
    api.get(`/public/orders/${numero}`).then((res) => res.data),

  // Search orders by email
  searchByEmail: (email: string): Promise<Orden[]> =>
    api.post('/public/orders/search', { email }).then((res) => res.data),
};

// Bank accounts (Public endpoints)
export const bankAccountsService = {
  // Get all active bank accounts
  getAll: (): Promise<CuentaBancaria[]> =>
    api.get('/public/bank-accounts').then((res) => res.data),
};

// Winners (Public endpoints)
export const winnersService = {
  // Get all announced winners
  getAll: (): Promise<any[]> =>
    api.get('/public/winners').then((res) => res.data),
};

// Admin Bank accounts (Protected endpoints)
export const adminBankAccountsService = {
  // Get all bank accounts (admin)
  getAll: (): Promise<CuentaBancaria[]> =>
    api.get('/bank-accounts').then((res) => res.data),

  // Create new bank account
  create: (data: Omit<CuentaBancaria, 'id'>): Promise<{ message: string; bank_account: CuentaBancaria }> =>
    api.post('/bank-accounts', data).then((res) => res.data),

  // Update bank account
  update: (id: number, data: Omit<CuentaBancaria, 'id'>): Promise<{ message: string; bank_account: CuentaBancaria }> =>
    api.put(`/bank-accounts/${id}`, data).then((res) => res.data),

  // Toggle bank account status
  toggle: (id: number): Promise<{ message: string; bank_account: CuentaBancaria }> =>
    api.patch(`/bank-accounts/${id}/toggle`).then((res) => res.data),

  // Delete bank account
  delete: (id: number): Promise<{ message: string }> =>
    api.delete(`/bank-accounts/${id}`).then((res) => res.data),
};

// Admin Winners (Protected endpoints)
export const adminWinnersService = {
  // Get all winners (admin)
  getAll: (): Promise<any[]> =>
    api.get('/winners').then((res) => res.data),

  // Get winners by activity number
  getByActivity: (activityId: number): Promise<any> =>
    api.get(`/activities/${activityId}/winners-by-number`).then((res) => res.data),

  // Create winner
  create: (data: any): Promise<{ message: string; winner: any }> =>
    api.post('/winners', data).then((res) => res.data),

  // Update winner
  update: (id: number, data: any): Promise<{ message: string; winner: any }> =>
    api.put(`/winners/${id}`, data).then((res) => res.data),

  // Mark as announced
  markAsAnnounced: (id: number): Promise<{ message: string; winner: any }> =>
    api.patch(`/winners/${id}/announce`).then((res) => res.data),

  // Delete winner
  delete: (id: number): Promise<{ message: string }> =>
    api.delete(`/winners/${id}`).then((res) => res.data),
};

// For backward compatibility, also export with old names
export const rifasService = activitiesService;
export const ordenesService = ordersService;
export const cuentasService = bankAccountsService;

export default api;