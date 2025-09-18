import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Orden, CuentaBancaria } from '../types';
import { ordersService, bankAccountsService } from '../services/api';
import './PaymentConfirmationPage.css';

// Mock data for testing
const mockCuentas: CuentaBancaria[] = [];

const mockOrden: Orden = {
  id: 1,
  numero_pedido: '197605',
  activity_id: 1,
  email_cliente: 'gabriel@email.com',
  nombre_cliente: 'Gabriel Reyes',
  telefono_cliente: '0955466833',
  direccion_cliente: 'Av Ciceron y Wistong Churchill, Ambato, Tungurahua',
  cedula_ruc: '1804758934',
  cantidad_boletos: 6,
  total_pagado: 9.00,
  metodo_pago: 'transferencia',
  estado: 'pendiente',
  fecha_limite_pago: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const PaymentConfirmationPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [orden, setOrden] = useState<Orden | null>(null);
  const [cuentas, setCuentas] = useState<CuentaBancaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);


  const formatTime = (milliseconds: number) => {
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const minutes = Math.min(totalMinutes, 60); // Limitar a máximo 60 minutos
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    loadData();
  }, [orderNumber]);

  const loadData = async () => {
    if (!orderNumber) return;
    
    try {
      setLoading(true);
      
      const [orderData, accountsData] = await Promise.all([
        ordersService.getByNumber(orderNumber),
        bankAccountsService.getAll()
      ]);
      setOrden(orderData);
      setCuentas(accountsData);
      setError(null);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar la información del pedido');
      // Fallback a mock data para desarrollo
      setOrden(mockOrden);
      setCuentas(mockCuentas);
    } finally {
      setLoading(false);
    }
  };

  const getNumericValue = (value: string | number): number => {
    return typeof value === 'string' ? parseFloat(value) : value;
  };

  const formatPrice = (price: string | number) => {
    const numPrice = getNumericValue(price);
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(numPrice);
  };

  const getBankLogo = (banco: string) => {
    switch (banco.toLowerCase()) {
      case 'banco pichincha':
        return '🏦'; // You would use actual bank logos here
      case 'banco guayaquil':
        return '🏪';
      case 'jardín azuayo':
        return '🌺';
      default:
        return '🏛️';
    }
  };

  useEffect(() => {
    if (!orden) return;
    
    // Calculate time remaining
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const deadline = new Date(orden.fecha_limite_pago).getTime();
      const remaining = deadline - now;
      
      if (remaining > 0) {
        setTimeRemaining(remaining);
      } else {
        setTimeRemaining(0);
      }
    };

    calculateTimeRemaining();
    const timer = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(timer);
  }, [orden]);

  if (loading) {
    return (
      <div className="payment-confirmation-page loading">
        <div className="container">
          <div className="loading-message">
            <h1>Cargando información del pedido...</h1>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !orden) {
    return (
      <div className="payment-confirmation-page error">
        <div className="container">
          <div className="error-message">
            <h1>Error</h1>
            <p>{error || 'No se pudo cargar la información del pedido'}</p>
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const whatsappMessage = `Hola! Acabo de realizar el pago para mi pedido #${orden.numero_pedido}. Adjunto el comprobante de ${orden.metodo_pago}. Total pagado: ${formatPrice(orden.total_pagado)}.`;
  const whatsappUrl = `https://wa.me/593984119133?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="payment-confirmation-page">
      <div className="container">
        <div className="confirmation-header">
          <div className="success-icon">✅</div>
          <h1>¡Gracias por tu compra!</h1>
          <p className="order-number">
            Número de Pedido: <strong>#{orden.numero_pedido}</strong>
          </p>
        </div>

        <div className="confirmation-content">
          {/* Order Summary */}
          <div className="order-summary-card card">
            <h3>Resumen del Pedido</h3>
            <div className="order-details">
              <div className="detail-row">
                <span>Cliente:</span>
                <span>{orden.nombre_cliente}</span>
              </div>
              <div className="detail-row">
                <span>Email:</span>
                <span>{orden.email_cliente}</span>
              </div>
              <div className="detail-row">
                <span>Cantidad de boletos:</span>
                <span>{orden.cantidad_boletos}</span>
              </div>
              <div className="detail-row total">
                <span>Total a pagar:</span>
                <span className="text-primary">{formatPrice(orden.total_pagado)}</span>
              </div>
              <div className="detail-row">
                <span>Método de pago:</span>
                <span className="capitalize">{orden.metodo_pago}</span>
              </div>
            </div>

            {timeRemaining > 0 && (
              <div className="time-warning">
                <div className="warning-icon">⏰</div>
                <div className="warning-content">
                  <p><strong>Tiempo restante para enviar comprobante:</strong></p>
                  <div className="countdown">{formatTime(timeRemaining)}</div>
                  <p className="warning-text">
                    Si no envías el comprobante dentro de este tiempo, 
                    tu pedido será cancelado automáticamente.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Payment Instructions */}
          <div className="payment-instructions-card card">
            <h3>Instrucciones de Pago</h3>
            
            <div className="payment-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Anota o haz una captura del NÚMERO DE PEDIDO</h4>
                  <div className="highlight-box">
                    <span className="order-highlight">#{orden.numero_pedido}</span>
                  </div>
                  <p>Esquina superior izquierda de esta pantalla</p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Transfiere el monto total y envía el COMPROBANTE</h4>
                  <p>
                    junto con el <strong>NÚMERO DE PEDIDO</strong> solo por{' '}
                    <strong>WHATSAPP</strong> al{' '}
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                      +593 98 411 9133
                    </a>{' '}
                    en un <strong>MÁXIMO DE 1 HORA</strong>, o el pedido será{' '}
                    <strong className="error-text">CANCELADO SIN REEMBOLSO</strong>.
                  </p>
                  <p className="note">
                    (Si ya enviaste el comprobante y no hemos respondido,{' '}
                    <strong>NO ENVÍES MÁS MENSAJES</strong>: respondemos en orden de llegada).
                  </p>
                </div>
              </div>

              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Una vez verificado el pago, recibirás tus NÚMEROS</h4>
                  <p>
                    por correo electrónico. Las transferencias interbancarias pueden 
                    tardar en acreditarse. También puedes consultar tus números en 
                    la web, en el apartado <strong>"Consulta tus números"</strong>.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bank Accounts */}
          <div className="bank-accounts-card card">
            <h3>Números de Cuenta:</h3>
            
            <div className="bank-accounts">
              {cuentas.filter(cuenta => cuenta.activa).map(cuenta => (
                <div key={cuenta.id} className="bank-account">
                  <div className="bank-header">
                    <span className="bank-logo">{getBankLogo(cuenta.banco)}</span>
                    <h4>{cuenta.banco}</h4>
                    <span className="account-type">
                      {cuenta.tipo_cuenta === 'corriente' ? 'Corriente' : 'Ahorros'}
                    </span>
                  </div>
                  
                  <div className="account-details">
                    <div className="account-row">
                      <span>Cuenta {cuenta.tipo_cuenta}:</span>
                      <strong>#{cuenta.numero_cuenta}</strong>
                    </div>
                    <div className="account-row">
                      <span>Titular:</span>
                      <span>{cuenta.titular}</span>
                    </div>
                    <div className="account-row">
                      <span>RUC:</span>
                      <span>{cuenta.cedula_ruc}</span>
                    </div>
                    <div className="account-row">
                      <span>Correo:</span>
                      <span>{cuenta.email_contacto}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-large whatsapp-btn"
            >
              📱 ENVIAR COMPROBANTE POR WHATSAPP
            </a>
            
            <Link to="/" className="btn btn-secondary">
              🏠 REGRESAR AL INICIO
            </Link>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <h4>Tus números</h4>
            <p>
              Serán generados una vez que verifiquemos el pago. Recuerda, esto puede tardar ya que la 
              verificación de pago es manual. Por favor, sigue las instrucciones detalladas más arriba 
              en esta misma página.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationPage;