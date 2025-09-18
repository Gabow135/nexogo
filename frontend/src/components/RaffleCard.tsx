import React from 'react';
import { Link } from 'react-router-dom';
import { Rifa } from '../types';
import './RaffleCard.css';

interface RaffleCardProps {
  rifa: Rifa;
}

const RaffleCard: React.FC<RaffleCardProps> = ({ rifa }) => {
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(numPrice);
  };

  const getNumericValue = (value: string | number): number => {
    return typeof value === 'string' ? parseFloat(value) : value;
  };

  const porcentajeNumerico = getNumericValue(rifa.porcentaje_vendido);
  const precioNumerico = getNumericValue(rifa.precio_boleto);

  const getProgressColor = () => {
    if (porcentajeNumerico >= 100) return 'completed';
    if (porcentajeNumerico >= 75) return 'high';
    if (porcentajeNumerico >= 50) return 'medium';
    return 'low';
  };

  const getUrgencyMessage = () => {
    const remainingPercentage = 100 - porcentajeNumerico;
    if (porcentajeNumerico >= 95) {
      return { 
        message: `¡Solo ${remainingPercentage.toFixed(1)}% restante!`, 
        type: 'critical',
        icon: '🔥'
      };
    }
    if (porcentajeNumerico >= 80) {
      return { 
        message: `¡${remainingPercentage.toFixed(1)}% para completar!`, 
        type: 'high',
        icon: '⚡'
      };
    }
    if (porcentajeNumerico >= 50) {
      return { 
        message: `${remainingPercentage.toFixed(1)}% disponible`, 
        type: 'medium',
        icon: '🎯'
      };
    }
    return null;
  };


  const getStatusBadge = () => {
    switch (rifa.estado) {
      case 'sorteo_en_curso':
        return <div className="status-badge drawing">🎲 SORTEO EN CURSO</div>;
      case 'finalizada':
        if (rifa.main_winner) {
          return <div className="status-badge finished">🏆 GANADOR: #{rifa.main_winner.numero_ganador}</div>;
        }
        return <div className="status-badge finished">🏆 FINALIZADA</div>;
      case 'cancelada':
        return <div className="status-badge cancelled">❌ CANCELADA</div>;
      default:
        if (porcentajeNumerico >= 100) {
          return <div className="status-badge ready">🔥 LISTO PARA SORTEO</div>;
        }
        return null;
    }
  };

  const isActive = rifa.estado === 'activa' && porcentajeNumerico < 100;
  const urgencyData = getUrgencyMessage();

  return (
    <div className={`raffle-card ${isActive ? 'active' : 'inactive'}`}>
      {getStatusBadge()}
      
      {/* Urgency Banner */}
      {urgencyData && (
        <div className={`urgency-banner ${urgencyData.type}`}>
          <span className="urgency-icon">{urgencyData.icon}</span>
          <span className="urgency-text">{urgencyData.message}</span>
        </div>
      )}
      
      <div className="raffle-image">
        <img src={rifa.imagen_url} alt={rifa.nombre} />
        <div className="activity-badge">
          # {rifa.actividad_numero}
        </div>
        
      </div>

      <div className="raffle-content">
        <h3 className="raffle-title">{rifa.nombre}</h3>
        <p className="raffle-description">{rifa.descripcion}</p>
        
        <div className="raffle-price">
          <span className="price-value text-primary">
            {formatPrice(precioNumerico)}
          </span>
          <span className="price-label">por boleto</span>
        </div>

        <div className="progress-section">
          <div className="progress-info">
            <span>Progreso de venta</span>
            <span className="progress-percentage">
              {porcentajeNumerico.toFixed(1)}%
            </span>
          </div>
          
          <div className={`progress-bar ${getProgressColor()}`}>
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min(porcentajeNumerico, 100)}%` }}
            />
          </div>
          
          <div className="progress-details">
            <span>Vendido: {porcentajeNumerico.toFixed(1)}%</span>
            <span>Falta: {(100 - porcentajeNumerico).toFixed(1)}%</span>
          </div>
        </div>

        {/* Winning Number Display */}
        {(rifa.estado === 'sorteo_en_curso' || rifa.estado === 'finalizada') && rifa.main_winner && (
          <div className="winning-number-display">
            <div className="winning-label">🏆 Número Ganador</div>
            <div className="winning-number-badge">#{rifa.main_winner.numero_ganador}</div>
            <div className="winning-prize">{rifa.nombre}</div>
          </div>
        )}

        {/* Enhanced Quick Purchase Buttons */}
        {isActive && (
          <div className="quick-purchase">
            <div className="value-proposition">
              <span className="value-text">
                💰 Solo {formatPrice(precioNumerico)} por boleto
              </span>
              {porcentajeNumerico >= 80 && (
                <span className="bonus-text">
                  ⚡ ¡+20% de probabilidad en números premiados!
                </span>
              )}
            </div>
            
            <div className="quick-buttons">
              <Link 
                to={`/comprar/${rifa.id}?quantity=5`} 
                className="btn btn-quick"
              >
                <div className="quick-qty">5</div>
                <div className="quick-price">{formatPrice(precioNumerico * 5)}</div>
              </Link>
              <Link 
                to={`/comprar/${rifa.id}?quantity=8`} 
                className="btn btn-quick popular"
              >
                <div className="quick-badge">POPULAR</div>
                <div className="quick-qty">8</div>
                <div className="quick-price">{formatPrice(precioNumerico * 8)}</div>
              </Link>
              <Link 
                to={`/comprar/${rifa.id}?quantity=12`} 
                className="btn btn-quick"
              >
                <div className="quick-qty">12</div>
                <div className="quick-price">{formatPrice(precioNumerico * 12)}</div>
              </Link>
              <Link 
                to={`/comprar/${rifa.id}?quantity=15`} 
                className="btn btn-quick"
              >
                <div className="quick-qty">15</div>
                <div className="quick-price">{formatPrice(precioNumerico * 15)}</div>
              </Link>
              <Link 
                to={`/comprar/${rifa.id}?quantity=20`} 
                className="btn btn-quick best-value"
              >
                <div className="quick-badge">MEJOR VALOR</div>
                <div className="quick-qty">20</div>
                <div className="quick-price">{formatPrice(precioNumerico * 20)}</div>
              </Link>
            </div>
            
            <Link 
              to={`/comprar/${rifa.id}`} 
              className="btn btn-primary btn-large purchase-btn pulsating"
            >
              <span className="btn-icon">🎯</span>
              <span className="btn-text">¡COMPRAR AHORA!</span>
              <span className="btn-subtext">Pago seguro con transferencia</span>
            </Link>

          </div>
        )}

        {!isActive && (
          <div className="inactive-message">
            {rifa.estado === 'sorteo_en_curso' && (
              <p>El sorteo está en curso. ¡Revisa pronto los resultados!</p>
            )}
            {rifa.estado === 'finalizada' && (
              <Link to={`/ganadores`} className="btn btn-secondary">
                Ver Ganador
              </Link>
            )}
            {porcentajeNumerico >= 100 && rifa.estado === 'activa' && (
              <p>¡Vendido! El sorteo automático iniciará pronto.</p>
            )}
          </div>
        )}

        {/* Lucky Numbers Display for Drawing Status */}
        {rifa.estado === 'sorteo_en_curso' && rifa.numeros_premiados && rifa.numeros_premiados.length > 0 && (
          <div className="lucky-numbers-display">
            <div className="lucky-numbers-header">
              <span className="lucky-numbers-title">🍀 NÚMEROS DE SUERTE</span>
            </div>
            <div className="lucky-numbers-grid">
              {rifa.numeros_premiados.map((numero, index) => (
                <span key={index} className="lucky-number-badge">
                  #{numero}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Lucky Numbers Display for Active Raffles */}
        {rifa.estado === 'activa' && rifa.numeros_premiados && rifa.numeros_premiados.length > 0 && (
          <div className="lucky-numbers-display active">
            <div className="lucky-numbers-header">
              <span className="lucky-numbers-title">🎁 NÚMEROS CON PREMIOS ESPECIALES</span>
            </div>
            <div className="lucky-numbers-grid">
              {rifa.numeros_premiados.map((numero, index) => (
                <span key={index} className="lucky-number-badge special">
                  #{numero}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaffleCard;