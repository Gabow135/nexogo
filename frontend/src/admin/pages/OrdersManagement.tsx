import React, { useState, useEffect } from 'react';
import { Orden } from '../../types';
import './OrdersManagement.css';

// Mock data - replace with actual API calls
const mockOrders: Orden[] = [
  {
    id: 1,
    numero_pedido: '197605',
    activity_id: 1,
    email_cliente: 'gabriel@email.com',
    nombre_cliente: 'Gabriel Reyes',
    telefono_cliente: '0955466833',
    direccion_cliente: 'Av Ciceron y Wistong Churchill, Ambato, Tungurahua',
    cedula_ruc: '1804758934',
    cantidad_boletos: 6,
    total_pagado: '6.00',
    metodo_pago: 'transferencia',
    estado: 'pendiente',
    fecha_limite_pago: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    numero_pedido: '197606',
    activity_id: 2,
    email_cliente: 'maria@email.com',
    nombre_cliente: 'María López',
    telefono_cliente: '0987654321',
    direccion_cliente: 'Calle 10 de Agosto, Quito, Pichincha',
    cedula_ruc: '1785432109',
    cantidad_boletos: 12,
    total_pagado: '12.00',
    metodo_pago: 'deposito',
    estado: 'pagado',
    fecha_limite_pago: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Orden[]>(mockOrders);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.estado === filter;
    const matchesSearch = 
      order.numero_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email_cliente.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const updateOrderStatus = (orderId: number, newStatus: 'pendiente' | 'pagado' | 'cancelado') => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, estado: newStatus, updated_at: new Date().toISOString() }
        : order
    ));
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-EC');
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'orange';
      case 'pagado': return 'green';
      case 'cancelado': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'pagado': return 'Pagado';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  };

  const getOrderCounts = () => {
    return {
      all: orders.length,
      pendiente: orders.filter(o => o.estado === 'pendiente').length,
      pagado: orders.filter(o => o.estado === 'pagado').length,
      cancelado: orders.filter(o => o.estado === 'cancelado').length,
    };
  };

  const counts = getOrderCounts();

  return (
    <div className="orders-management">
      <div className="page-header">
        <h1>Gestión de Órdenes</h1>
        <p className="page-subtitle">
          Administra todas las órdenes y pagos del sistema
        </p>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="orders-filters">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas ({counts.all})
            </button>
            <button 
              className={`filter-tab ${filter === 'pendiente' ? 'active' : ''}`}
              onClick={() => setFilter('pendiente')}
            >
              Pendientes ({counts.pendiente})
            </button>
            <button 
              className={`filter-tab ${filter === 'pagado' ? 'active' : ''}`}
              onClick={() => setFilter('pagado')}
            >
              Pagadas ({counts.pagado})
            </button>
            <button 
              className={`filter-tab ${filter === 'cancelado' ? 'active' : ''}`}
              onClick={() => setFilter('cancelado')}
            >
              Canceladas ({counts.cancelado})
            </button>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por número, cliente o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card">
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Boletos</th>
                <th>Total</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <div className="order-id">
                      <strong>#{order.numero_pedido}</strong>
                      <small>ID: {order.id}</small>
                    </div>
                  </td>
                  <td>
                    <div className="client-info">
                      <div className="client-name">{order.nombre_cliente}</div>
                      <div className="client-email">{order.email_cliente}</div>
                      <div className="client-id">CI: {order.cedula_ruc}</div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{order.telefono_cliente}</div>
                      <div className="address">{order.direccion_cliente.substring(0, 30)}...</div>
                    </div>
                  </td>
                  <td>
                    <div className="tickets-info">
                      <strong>{order.cantidad_boletos}</strong>
                      <small>boletos</small>
                    </div>
                  </td>
                  <td>
                    <div className="total-amount">
                      {formatCurrency(order.total_pagado)}
                    </div>
                  </td>
                  <td>
                    <span className="payment-method">
                      {order.metodo_pago === 'transferencia' ? '🏦 Transferencia' : '💰 Depósito'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(order.estado)}`}>
                      {getStatusText(order.estado)}
                    </span>
                  </td>
                  <td>
                    <div className="date-info">
                      <div>{formatDate(order.created_at)}</div>
                      {order.estado === 'pendiente' && (
                        <div className="deadline">
                          Vence: {formatDate(order.fecha_limite_pago)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      {order.estado === 'pendiente' && (
                        <>
                          <button 
                            className="action-btn green"
                            onClick={() => updateOrderStatus(order.id, 'pagado')}
                            title="Marcar como Pagado"
                          >
                            ✅
                          </button>
                          <button 
                            className="action-btn red"
                            onClick={() => updateOrderStatus(order.id, 'cancelado')}
                            title="Cancelar"
                          >
                            ❌
                          </button>
                        </>
                      )}
                      {order.estado === 'cancelado' && (
                        <button 
                          className="action-btn orange"
                          onClick={() => updateOrderStatus(order.id, 'pendiente')}
                          title="Reactivar"
                        >
                          🔄
                        </button>
                      )}
                      <a 
                        href={`https://wa.me/${order.telefono_cliente.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn blue"
                        title="WhatsApp"
                      >
                        📱
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;