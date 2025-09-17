import React, { useState, useEffect } from 'react';
import { Orden } from '../types';
import { apiService } from '../services/api';
import './OrdersManagement.css';

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Orden[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderNumbers, setSelectedOrderNumbers] = useState<{order: Orden, show: boolean} | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await apiService.getOrders();
      setOrders(data);
      setError(null);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Error al cargar las órdenes');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.estado === filter;
    const matchesSearch = 
      order.numero_pedido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email_cliente.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const updateOrderStatus = async (orderId: number, newStatus: 'pendiente' | 'pagado' | 'cancelado') => {
    try {
      await apiService.updateOrderStatus(orderId.toString(), newStatus);
      // Refresh orders after update
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Error al actualizar el estado de la orden');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const toNumber = (value: string | number): number => {
    return typeof value === 'string' ? parseFloat(value) || 0 : value;
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

  if (loading) {
    return (
      <div className="orders-management">
        <div className="page-header">
          <h1>Gestión de Órdenes</h1>
          <p className="page-subtitle">Cargando órdenes...</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-management">
      <div className="page-header">
        <h1>Gestión de Órdenes</h1>
        <p className="page-subtitle">
          Administra todas las órdenes y pagos del sistema
        </p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={loadOrders} className="retry-btn">
            Reintentar
          </button>
        </div>
      )}

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
                      {order.estado === 'pagado' && order.numeros_boletos && order.numeros_boletos.length > 0 && (
                        <div className="ticket-numbers">
                          <div className="ticket-numbers-header">
                            Números asignados:
                          </div>
                          <div className="ticket-numbers-list">
                            {order.numeros_boletos.slice(0, 3).map((numero, index) => (
                              <span key={index} className="ticket-number">
                                {numero}
                              </span>
                            ))}
                            {order.numeros_boletos.length > 3 && (
                              <button 
                                className="ticket-number" 
                                style={{background: '#FF9800', cursor: 'pointer'}}
                                onClick={() => setSelectedOrderNumbers({order, show: true})}
                              >
                                +{order.numeros_boletos.length - 3} más
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="total-amount">
                      {formatCurrency(toNumber(order.total_pagado))}
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

      {/* Modal para ver todos los números */}
      {selectedOrderNumbers && selectedOrderNumbers.show && (
        <div className="modal-overlay" onClick={() => setSelectedOrderNumbers(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Números de Boletos - Pedido #{selectedOrderNumbers.order.numero_pedido}</h3>
              <button className="modal-close" onClick={() => setSelectedOrderNumbers(null)}>✕</button>
            </div>
            <div className="modal-body" style={{padding: '20px'}}>
              <div className="customer-info" style={{marginBottom: '20px'}}>
                <h4>Cliente: {selectedOrderNumbers.order.nombre_cliente}</h4>
                <p>Email: {selectedOrderNumbers.order.email_cliente}</p>
                <p>Total de boletos: {selectedOrderNumbers.order.cantidad_boletos}</p>
              </div>
              <div className="all-ticket-numbers">
                <h4 style={{marginBottom: '15px', color: '#2196F3'}}>Números Asignados:</h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                  gap: '10px'
                }}>
                  {selectedOrderNumbers.order.numeros_boletos?.map((numero, index) => (
                    <div key={index} style={{
                      background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontFamily: 'Courier New, monospace',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {numero}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;