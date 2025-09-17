import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rifa } from '../types';
import { activitiesService } from '../services/api';
import RaffleCard from '../components/RaffleCard';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllRifas, setShowAllRifas] = useState(false);
  const [consultEmail, setConsultEmail] = useState('');

  // Load activities from API
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activitiesService.getAll();
      setRifas(data);
      setError(null);
    } catch (error) {
      console.error('Error loading activities:', error);
      setError('Error al cargar las actividades');
    } finally {
      setLoading(false);
    }
  };

  // Filter raffles: active ones first, then others
  const rifasActivas = rifas.filter(r => r.estado === 'activa' && Number(r.porcentaje_vendido) < 100);
  const rifasEnSorteo = rifas.filter(r => r.estado === 'sorteo_en_curso' || (r.estado === 'activa' && Number(r.porcentaje_vendido) >= 100));
  const rifasFinalizadas = rifas.filter(r => r.estado === 'finalizada');
  const rifasConGanador = rifasFinalizadas.filter(r => (r as any).main_winner);
  
  const rifasToShow = showAllRifas 
    ? [...rifasActivas, ...rifasEnSorteo]
    : [...rifasActivas, ...rifasEnSorteo];

  const handleConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (consultEmail) {
      navigate(`/consultar?email=${encodeURIComponent(consultEmail)}`);
    }
  };

  if (loading) {
    return (
      <div className="homepage">
        <div className="hero-section">
          <div className="container">
            <div className="loading-message">
              <h1>Cargando actividades...</h1>
              <div className="spinner"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage">
        <div className="hero-section">
          <div className="container">
            <div className="error-message">
              <h1>Error al cargar las actividades</h1>
              <p>{error}</p>
              <button onClick={loadActivities} className="btn btn-primary">
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <img 
              src="/logo-nexogo.png" 
              alt="NexoGo Logo"   
              className="hero-logo"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/logo-nexogo.png';
              }}
            />
            <h1 className="hero-title">
              ¡Participa y <span className="gradient-text">GANA</span>!
            </h1>
            <p className="hero-subtitle">
              Actividades transparentes con números aleatorios y sorteos automáticos
            </p>
            
            {rifasActivas.length > 0 && (
              <div className="hero-cta">
                <Link 
                  to={`/comprar/${rifasActivas[0].id}`}
                  className="btn btn-primary btn-lg"
                >
                  ¡Comprar Boletos Ahora!
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Current Raffles Section */}
      <section className="raffles-section">
        <div className="container">
          <div className="section-header">
            <h2>Actividades Disponibles</h2>
            <p>Selecciona tu premio favorito y participa</p>
          </div>

          {rifasToShow.length === 0 ? (
            <div className="no-raffles">
              <h3>No hay actividades disponibles en este momento</h3>
              <p>¡Mantente atento para próximas oportunidades!</p>
            </div>
          ) : (
            <>
              <div className="raffles-grid">
                {rifasToShow.map((rifa) => (
                  <RaffleCard 
                    key={rifa.id} 
                    rifa={rifa}
                  />
                ))}
              </div>

            </>
          )}
        </div>
      </section>

      {/* Quick Consultation Section */}
      <section className="consultation-section">
        <div className="container">
          <div className="consultation-card">
            <h3>¿Ya tienes boletos?</h3>
            <p>Consulta el estado de tus boletos y números asignados</p>
            <form onSubmit={handleConsultation} className="consultation-form">
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  value={consultEmail}
                  onChange={(e) => setConsultEmail(e.target.value)}
                  className="consultation-input"
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Consultar
                </button>
              </div>
            </form>
            <Link to="/consultar" className="btn btn-outline consultation-alt-link">
              O consulta por número de pedido
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <div className="container padding-section">
          <h2>¿Cómo Funciona?</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Elige tu premio</h3>
              <p>Selecciona la actividad de tu interés y la cantidad de boletos</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Realiza el pago</h3>
              <p>Paga por transferencia o depósito a nuestras cuentas oficiales</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Números automáticos</h3>
              <p>Recibirás números aleatorios únicos al confirmar tu pago</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>¡Gana automáticamente!</h3>
              <p>Si tus números coinciden con los premiados, ¡eres ganador!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;