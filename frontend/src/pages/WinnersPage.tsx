import React, { useState, useEffect } from 'react';
import { winnersService } from '../services/api';
import './WinnersPage.css';

interface Winner {
  id: number;
  activity_name: string;
  activity_number: string;
  activity_image: string;
  numero_ganador: string;
  fecha_sorteo: string;
  winner_name: string;
  numeros_premiados: string[];
}

const WinnersPage: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWinners();
  }, []);

  const loadWinners = async () => {
    try {
      setLoading(true);
      const winnersData = await winnersService.getAll();
      setWinners(winnersData);
    } catch (error) {
      console.error('Error loading winners:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container winners-page">
        <div className="loading-state">
          <h2>Cargando ganadores...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container winners-page">
      <div className="page-header">
        <h1>🏆 Ganadores Oficiales</h1>
        <p className="page-subtitle centered-text">
          ¡Felicidades a todos nuestros ganadores! Aquí están los resultados oficiales de nuestros sorteos.
        </p>
      </div>

      {winners.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h2>¡Los sorteos están por comenzar!</h2>
          <p>
            Los primeros ganadores aparecerán aquí una vez que se realicen los sorteos.
            ¡Mantente atento a nuestras redes sociales!
          </p>
        </div>
      ) : (
        <div className="winners-grid">
          {winners.map((winner) => (
            <div key={winner.id} className="winner-card">
              <div className="winner-image">
                <img 
                  src={winner.activity_image} 
                  alt={winner.activity_name}
                  loading="lazy"
                />
                <div className="activity-badge">
                  # {winner.activity_number}
                </div>
              </div>
              
              <div className="winner-content">
                <h3 className="prize-name">{winner.activity_name}</h3>
                
                <div className="winning-info">
                  <div className="winning-number">
                    <span className="number-label">Número Ganador</span>
                    <span className="number-value">{winner.numero_ganador}</span>
                  </div>

                  {winner.numeros_premiados && winner.numeros_premiados.length > 0 && (
                    <div className="lucky-numbers">
                      <span className="lucky-numbers-label">Números de Suerte</span>
                      <div className="lucky-numbers-grid">
                        {winner.numeros_premiados.map((numero, index) => (
                          <span 
                            key={index} 
                            className={`lucky-number ${numero === winner.numero_ganador ? 'main-winner' : ''}`}
                          >
                            {numero}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="winner-details">
                    <div className="winner-date centered">
                      <span className="date-label">Fecha del Sorteo</span>
                      <span className="date-value">{formatDate(winner.fecha_sorteo)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="winner-celebration">
                <div className="celebration-emoji">🎉</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="winners-footer">
        <div className="social-reminder">
          <h3>📢 Síguenos en nuestras redes</h3>
          <p>
            Todos los ganadores son anunciados oficialmente en nuestras redes sociales.
            ¡No te pierdas las próximas actividades!
          </p>
          <div className="social-links">
            <span className="social-link">📱 Instagram: @nexogoEc</span>
            <span className="social-link">🎵 TikTok: @nexogoEc</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WinnersPage;