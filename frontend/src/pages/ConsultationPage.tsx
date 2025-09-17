import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ordersService } from '../services/api';
import { Orden } from '../types';
import './ConsultationPage.css';

const ConsultationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState<'email' | 'order'>('email');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orders, setOrders] = useState<Orden[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Orden | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      setSearchType('email');
      searchByEmail(emailParam);
    }
  }, [searchParams]);

  const searchByEmail = async (emailToSearch?: string) => {
    const searchEmail = emailToSearch || email;
    if (!searchEmail) {
      setError('Por favor ingresa un correo electrónico');
      return;
    }

    setLoading(true);
    setError(null);
    setSelectedOrder(null);
    
    try {
      const data = await ordersService.searchByEmail(searchEmail);
      setOrders(data);
      if (data.length === 0) {
        setError('No se encontraron órdenes con este correo electrónico');
      }
    } catch (err) {
      console.error('Error searching orders:', err);
      setError('Error al buscar órdenes. Por favor intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const searchByOrderNumber = async () => {
    if (!orderNumber) {
      setError('Por favor ingresa un número de pedido');
      return;
    }

    setLoading(true);
    setError(null);
    setOrders([]);
    
    try {
      const data = await ordersService.getByNumber(orderNumber);
      setSelectedOrder(data);
    } catch (err) {
      console.error('Error searching order:', err);
      setError('No se encontró una orden con este número');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchType === 'email') {
      searchByEmail();
    } else {
      searchByOrderNumber();
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pagado': return 'success';
      case 'pendiente': return 'warning';
      case 'cancelado': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'pagado': return 'Pagado';
      case 'pendiente': return 'Pendiente de Pago';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(numPrice);
  };

  const renderOrderDetails = (order: Orden) => (
    <div className="order-card" key={order.id}>
      <div className="order-header">
        <div className="order-number-section">
          <span className="order-label">Pedido #</span>
          <span className="order-number">{order.numero_pedido}</span>
        </div>
        <div className={`order-status status-${getStatusColor(order.estado)}`}>
          {getStatusText(order.estado)}
        </div>
      </div>

      <div className="order-info">
        <div className="info-row">
          <span className="info-label">Actividad:</span>
          <span className="info-value">{order.activity?.nombre || 'N/A'}</span>
        </div>
        
        <div className="info-row">
          <span className="info-label">Cliente:</span>
          <span className="info-value">{order.nombre_cliente}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Email:</span>
          <span className="info-value">{order.email_cliente}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Teléfono:</span>
          <span className="info-value">{order.telefono_cliente}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Cantidad de Boletos:</span>
          <span className="info-value">{order.cantidad_boletos}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Total Pagado:</span>
          <span className="info-value highlight">{formatPrice(order.total_pagado)}</span>
        </div>

        <div className="info-row">
          <span className="info-label">Fecha de Compra:</span>
          <span className="info-value">{formatDate(order.created_at)}</span>
        </div>

        {order.fecha_limite_pago && order.estado === 'pendiente' && (
          <div className="info-row">
            <span className="info-label">Fecha Límite de Pago:</span>
            <span className="info-value warning">{formatDate(order.fecha_limite_pago)}</span>
          </div>
        )}

        {order.numeros_boletos && order.numeros_boletos.length > 0 && (
          <div className="ticket-numbers-section">
            <h4>Tus Números de Boleto</h4>
            <div className="ticket-numbers-grid">
              {order.numeros_boletos.map((numero, index) => (
                <span key={index} className="ticket-number">
                  #{numero}
                </span>
              ))}
            </div>
          </div>
        )}

        {order.estado === 'pendiente' && (
          <div className="payment-instructions">
            <h4>📌 Instrucciones de Pago</h4>
            <p>Por favor realiza tu pago antes de la fecha límite y envía el comprobante al WhatsApp oficial.</p>
            <p className="warning-text">⚠️ Tu orden será cancelada automáticamente si no se confirma el pago antes de la fecha límite.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="consultation-page">
      <div className="container">
        <div className="page-header">
          <h1>📋 Consultar Mis Boletos</h1>
          <p>Ingresa tu correo electrónico o número de pedido para ver el estado de tus boletos</p>
        </div>

        <div className="search-section">
          <div className="search-type-selector">
            <button
              className={`type-btn ${searchType === 'email' ? 'active' : ''}`}
              onClick={() => setSearchType('email')}
            >
              Buscar por Email
            </button>
            <button
              className={`type-btn ${searchType === 'order' ? 'active' : ''}`}
              onClick={() => setSearchType('order')}
            >
              Buscar por Número de Pedido
            </button>
          </div>

          <form onSubmit={handleSubmit} className="search-form">
            {searchType === 'email' ? (
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="search-input"
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            ) : (
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Ingresa tu número de pedido"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="search-input"
                  required
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            )}
          </form>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>

        <div className="results-section">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Buscando tus órdenes...</p>
            </div>
          )}

          {!loading && orders.length > 0 && (
            <>
              <h2>📦 Tus Órdenes ({orders.length})</h2>
              <div className="orders-grid">
                {orders.map(order => renderOrderDetails(order))}
              </div>
            </>
          )}

          {!loading && selectedOrder && renderOrderDetails(selectedOrder)}

          {!loading && !error && orders.length === 0 && !selectedOrder && searchType === 'email' && email && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No se encontraron órdenes</h3>
              <p>No hay órdenes asociadas con el correo: {email}</p>
            </div>
          )}
        </div>

        <div className="help-section">
          <h3>💡 ¿Necesitas ayuda?</h3>
          <p>Si tienes problemas para encontrar tu orden, contáctanos por WhatsApp con tu número de pedido o comprobante de pago.</p>
          <div className="contact-info">
            <span className="whatsapp-link">📱 WhatsApp: +593 XX XXX XXXX</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;