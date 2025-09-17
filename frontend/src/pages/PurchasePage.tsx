import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Rifa, CompraRequest } from '../types';
import { activitiesService, ordersService } from '../services/api';
import './PurchasePage.css';

const PurchasePage: React.FC = () => {
  const { rifaId } = useParams<{ rifaId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [rifa, setRifa] = useState<Rifa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cantidad, setCantidad] = useState(parseInt(searchParams.get('quantity') || '5'));
  const [formData, setFormData] = useState({
    nombre_cliente: '',
    email_cliente: '',
    telefono_cliente: '',
    direccion_cliente: '',
    cedula_ruc: '',
    metodo_pago: 'transferencia' as 'transferencia' | 'deposito',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadRifa();
  }, [rifaId]);

  const loadRifa = async () => {
    if (!rifaId) return;
    
    try {
      setLoading(true);
      const data = await activitiesService.getById(parseInt(rifaId));
      setRifa(data);
      setError(null);
    } catch (error) {
      console.error('Error loading rifa:', error);
      setError('Error al cargar la información de la rifa');
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

  // Function to check if form is valid without setting errors
  const isFormValid = () => {
    if (!formData.nombre_cliente.trim()) return false;
    if (!formData.email_cliente.trim() || !/\S+@\S+\.\S+/.test(formData.email_cliente)) return false;
    if (!formData.telefono_cliente.trim() || !/^\d{10}$/.test(formData.telefono_cliente.replace(/\D/g, ''))) return false;
    if (!formData.direccion_cliente.trim()) return false;
    if (!formData.cedula_ruc.trim() || !/^\d{10}(\d{3})?$/.test(formData.cedula_ruc)) return false;
    if (cantidad < 1) return false;
    if (rifa && cantidad > boletosDisponibles) return false;
    return true;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre_cliente.trim()) {
      newErrors.nombre_cliente = 'El nombre es obligatorio';
    }

    if (!formData.email_cliente.trim()) {
      newErrors.email_cliente = 'El email es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email_cliente)) {
      newErrors.email_cliente = 'El email no es válido';
    }

    if (!formData.telefono_cliente.trim()) {
      newErrors.telefono_cliente = 'El teléfono es obligatorio';
    } else if (!/^\d{10}$/.test(formData.telefono_cliente.replace(/\D/g, ''))) {
      newErrors.telefono_cliente = 'El teléfono debe tener 10 dígitos';
    }

    if (!formData.direccion_cliente.trim()) {
      newErrors.direccion_cliente = 'La dirección es obligatoria';
    }

    if (!formData.cedula_ruc.trim()) {
      newErrors.cedula_ruc = 'La cédula/RUC es obligatoria';
    } else if (!/^\d{10}(\d{3})?$/.test(formData.cedula_ruc)) {
      newErrors.cedula_ruc = 'Cédula (10 dígitos) o RUC (13 dígitos) válido';
    }

    if (cantidad < 1) {
      newErrors.cantidad = 'Debe comprar al menos 1 boleto';
    }

    if (rifa && cantidad > boletosDisponibles) {
      if (boletosDisponibles === 0) {
        newErrors.cantidad = 'Ya no hay boletos disponibles para esta actividad';
      } else {
        newErrors.cantidad = `Solo quedan ${boletosDisponibles} boletos disponibles. Máximo permitido: ${boletosDisponibles}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !rifa) return;

    setLoading(true);

    try {
      const compraData: CompraRequest = {
        rifa_id: rifa.id,
        cantidad_boletos: cantidad,
        ...formData,
      };

      const response = await ordersService.create(compraData);
      navigate(`/pago-confirmacion/${response.order.numero_pedido}`);

    } catch (error) {
      console.error('Error al procesar compra:', error);
      setError('Error al procesar la compra. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="purchase-page loading">
        <div className="container">
          <div className="loading-message">
            <h1>Cargando información...</h1>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !rifa) {
    return (
      <div className="purchase-page error">
        <div className="container">
          <div className="error-message">
            <h1>Error</h1>
            <p>{error || 'No se pudo cargar la información de la rifa'}</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const precioNumerico = getNumericValue(rifa.precio_boleto);
  const porcentajeNumerico = getNumericValue(rifa.porcentaje_vendido);
  const totalPago = precioNumerico * cantidad;
  const boletosDisponibles = rifa.total_boletos - rifa.boletos_vendidos;

  return (
    <div className="purchase-page">
      <div className="container">
        <div className="purchase-header">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Volver
          </button>
          <h1>Comprar Boletos</h1>
        </div>

        <div className="purchase-content">
          {/* Product Info */}
          <div className="product-card card">
            <div className="product-image">
              <img src={rifa.imagen_url} alt={rifa.nombre} />
              <div className="activity-badge">{rifa.actividad_numero}</div>
            </div>
            
            <div className="product-info">
              <h2>{rifa.nombre}</h2>
              <p className="product-description">{rifa.descripcion}</p>
              
              <div className="price-info">
                <span className="price-label">Precio por boleto:</span>
                <span className="price-value text-primary">
                  {formatPrice(precioNumerico)}
                </span>
              </div>

              <div className="availability-info">
                <div className="progress-section">
                  <div className="progress-info">
                    <span>Progreso de venta</span>
                    <span>{(100 - porcentajeNumerico).toFixed(1)}% disponible</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${rifa.porcentaje_vendido}%` }}
                    />
                  </div>
                  <div className="progress-details">
                    <span>Vendido: {porcentajeNumerico.toFixed(1)}%</span>
                    <span>Disponible: {(100 - porcentajeNumerico).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {rifa.numeros_premiados && rifa.numeros_premiados.length > 0 && (
                <div className="prize-numbers-info">
                  <h4>🎁 Números con Premios Especiales</h4>
                  <p>Esta actividad tiene {rifa.numeros_premiados.length} números con premios adicionales.</p>
                  <div className="special-numbers">
                    {rifa.numeros_premiados.map((numero, index) => (
                      <span key={index} className="special-number">
                        {numero}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Purchase Form */}
          <div className="purchase-form-card card">
            <h3>Datos de Compra</h3>
            
            <form onSubmit={handleSubmit} className="purchase-form">
              {/* Quantity Selection */}
              <div className="form-group">
                <label>Cantidad de Boletos</label>
                <div className="quantity-section">
                  <div className="quick-quantities">
                    {[5, 8, 12, 15, 20].filter(q => q <= boletosDisponibles).map(q => (
                      <button
                        key={q}
                        type="button"
                        className={`quantity-btn ${cantidad === q ? 'active' : ''}`}
                        onClick={() => setCantidad(q)}
                      >
                        {q}
                      </button>
                    ))}
                    {boletosDisponibles > 0 && boletosDisponibles < 5 && (
                      <button
                        type="button"
                        className={`quantity-btn ${cantidad === boletosDisponibles ? 'active' : ''}`}
                        onClick={() => setCantidad(boletosDisponibles)}
                      >
                        {boletosDisponibles} (Máx.)
                      </button>
                    )}
                  </div>
                  <div className="custom-quantity">
                    <label>Cantidad personalizada:</label>
                    <input
                      type="number"
                      min="1"
                      max={boletosDisponibles}
                      value={cantidad}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 1;
                        setCantidad(Math.min(newValue, boletosDisponibles));
                      }}
                      className={`quantity-input ${cantidad > boletosDisponibles ? 'error' : ''}`}
                    />
                    <small className="quantity-info">
                      Máximo disponible: {boletosDisponibles.toLocaleString()} boletos
                    </small>
                  </div>
                </div>
                {errors.cantidad && <span className="error-text">{errors.cantidad}</span>}
              </div>

              {/* Personal Information */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre_cliente">Nombre Completo *</label>
                  <input
                    type="text"
                    id="nombre_cliente"
                    name="nombre_cliente"
                    value={formData.nombre_cliente}
                    onChange={handleInputChange}
                    className={errors.nombre_cliente ? 'error' : ''}
                    placeholder="Juan Pérez"
                  />
                  {errors.nombre_cliente && <span className="error-text">{errors.nombre_cliente}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email_cliente">Email *</label>
                  <input
                    type="email"
                    id="email_cliente"
                    name="email_cliente"
                    value={formData.email_cliente}
                    onChange={handleInputChange}
                    className={errors.email_cliente ? 'error' : ''}
                    placeholder="juan@email.com"
                  />
                  {errors.email_cliente && <span className="error-text">{errors.email_cliente}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="telefono_cliente">Teléfono *</label>
                  <input
                    type="tel"
                    id="telefono_cliente"
                    name="telefono_cliente"
                    value={formData.telefono_cliente}
                    onChange={handleInputChange}
                    className={errors.telefono_cliente ? 'error' : ''}
                    placeholder="0999123456"
                  />
                  {errors.telefono_cliente && <span className="error-text">{errors.telefono_cliente}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cedula_ruc">Cédula/RUC *</label>
                  <input
                    type="text"
                    id="cedula_ruc"
                    name="cedula_ruc"
                    value={formData.cedula_ruc}
                    onChange={handleInputChange}
                    className={errors.cedula_ruc ? 'error' : ''}
                    placeholder="1234567890"
                  />
                  {errors.cedula_ruc && <span className="error-text">{errors.cedula_ruc}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="direccion_cliente">Dirección Completa *</label>
                <textarea
                  id="direccion_cliente"
                  name="direccion_cliente"
                  value={formData.direccion_cliente}
                  onChange={handleInputChange}
                  className={errors.direccion_cliente ? 'error' : ''}
                  placeholder="Av. Principal 123 y Secundaria, Sector Norte"
                  rows={3}
                />
                {errors.direccion_cliente && <span className="error-text">{errors.direccion_cliente}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="metodo_pago">Método de Pago *</label>
                <select
                  id="metodo_pago"
                  name="metodo_pago"
                  value={formData.metodo_pago}
                  onChange={handleInputChange}
                >
                  <option value="transferencia">Transferencia Bancaria</option>
                  <option value="deposito">Depósito Bancario</option>
                </select>
              </div>

              {/* Total */}
              <div className="total-section">
                <div className="total-breakdown">
                  <div className="total-line">
                    <span>Boletos: {cantidad.toLocaleString()}</span>
                    <span>{formatPrice(precioNumerico)} c/u</span>
                  </div>
                  <div className="total-line subtotal">
                    <span>Subtotal:</span>
                    <span>{formatPrice(totalPago)}</span>
                  </div>
                  <div className="total-line final">
                    <span>Total a Pagar:</span>
                    <span className="text-primary">{formatPrice(totalPago)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large submit-btn"
                disabled={loading || boletosDisponibles < cantidad || !isFormValid()}
              >
                {loading ? 'Procesando...' : 
                 boletosDisponibles === 0 ? 'SIN BOLETOS DISPONIBLES' :
                 boletosDisponibles < cantidad ? `MÁXIMO ${boletosDisponibles} BOLETOS` :
                 `CONTINUAR CON PAGO - ${formatPrice(totalPago)}`}
              </button>

              {boletosDisponibles === 0 && (
                <div className="availability-warning error">
                  <div className="warning-icon">❌</div>
                  <p>Esta actividad ya no tiene boletos disponibles.</p>
                </div>
              )}

              {boletosDisponibles > 0 && boletosDisponibles < 10 && (
                <div className="availability-warning urgent">
                  <div className="warning-icon">⚡</div>
                  <p><strong>¡Últimos {boletosDisponibles} boletos disponibles!</strong> Compra ahora antes de que se agoten.</p>
                </div>
              )}

              <div className="form-disclaimer">
                <p>
                  Al continuar, recibirás instrucciones de pago y tendrás <strong>1 hora</strong> 
                  para enviar el comprobante por WhatsApp. Tus números se asignarán 
                  automáticamente después de verificar el pago.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;