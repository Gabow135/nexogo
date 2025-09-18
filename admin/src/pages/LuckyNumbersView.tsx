import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import './LuckyNumbersView.css';

interface Winner {
  id: number;
  numero_ganador: string;
  es_numero_premiado: boolean;
  fecha_sorteo: string;
  anunciado_en_instagram: boolean;
  notas?: string;
  order?: {
    id: number;
    numero_pedido: string;
    nombre_cliente: string;
    email_cliente: string;
    telefono_cliente: string;
    cantidad_boletos: number;
  };
}

interface WinnerByNumber {
  numero: string;
  winner: Winner | null;
  order: any;
}

interface Activity {
  id: number;
  nombre: string;
  actividad_numero: string;
  cantidad_numeros_suerte: number;
  numeros_premiados: string[];
  total_boletos: number;
  boletos_vendidos: number;
  porcentaje_vendido: number;
}

interface LuckyNumbersData {
  activity: Activity;
  winners_by_number: WinnerByNumber[];
}

const LuckyNumbersView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<LuckyNumbersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [executingRaffle, setExecutingRaffle] = useState(false);
  const [raffleResult, setRaffleResult] = useState<string | null>(null);

  useEffect(() => {
    loadLuckyNumbers();
  }, [id]);

  const loadLuckyNumbers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLuckyNumbers(parseInt(id!));
      setData(response);
      setError(null);
    } catch (error) {
      console.error('Error loading lucky numbers:', error);
      setError('Error al cargar los números de suerte');
    } finally {
      setLoading(false);
    }
  };

  const executeAutomaticRaffle = async () => {
    try {
      setExecutingRaffle(true);
      const response = await apiService.executeAutomaticRaffle(parseInt(id!));

      setRaffleResult(response.message);
      await loadLuckyNumbers(); // Recargar datos

      // Limpiar mensaje después de 5 segundos
      setTimeout(() => setRaffleResult(null), 5000);
    } catch (error) {
      console.error('Error executing raffle:', error);
      setError('Error al ejecutar el sorteo automático');
    } finally {
      setExecutingRaffle(false);
    }
  };

  if (loading) {
    return (
      <div className="lucky-numbers-view">
        <div className="page-header">
          <h1>Números de Suerte</h1>
          <p className="page-subtitle">Cargando números...</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lucky-numbers-view">
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            ← Volver
          </button>
          <h1>Números de Suerte</h1>
        </div>
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={loadLuckyNumbers} className="retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div className="lucky-numbers-view">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          ← Volver
        </button>
        <div>
          <h1>Números de Suerte</h1>
          <p className="page-subtitle">
            {data.activity.nombre} ({data.activity.actividad_numero})
          </p>
        </div>
      </div>

      <div className="activity-info-card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px'}}>
          <h3>Información de la Actividad</h3>
          {data.activity.porcentaje_vendido >= 100 && (
            <button
              className="btn btn-success"
              onClick={executeAutomaticRaffle}
              disabled={executingRaffle}
              style={{minWidth: '200px'}}
            >
              {executingRaffle ? '🔄 Ejecutando...' : '🎲 Ejecutar Sorteo Automático'}
            </button>
          )}
        </div>
        
        {raffleResult && (
          <div className="raffle-result" style={{
            background: '#e8f5e8', 
            border: '1px solid #4caf50', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '20px',
            color: '#2e7d32'
          }}>
            ✅ {raffleResult}
          </div>
        )}
        
        <div className="info-grid">
          <div className="info-item">
            <label>Nombre:</label>
            <span>{data.activity.nombre}</span>
          </div>
          <div className="info-item">
            <label>Número:</label>
            <span>{data.activity.actividad_numero}</span>
          </div>
          <div className="info-item">
            <label>Números de Suerte:</label>
            <span>{data.activity.cantidad_numeros_suerte}</span>
          </div>
          <div className="info-item">
            <label>Boletos Vendidos:</label>
            <span>{data.activity.boletos_vendidos} / {data.activity.total_boletos}</span>
          </div>
          <div className="info-item">
            <label>Porcentaje Vendido:</label>
            <span style={{
              color: data.activity.porcentaje_vendido >= 100 ? '#4caf50' : '#ff9800',
              fontWeight: 'bold'
            }}>
              {data.activity.porcentaje_vendido.toFixed(1)}%
              {data.activity.porcentaje_vendido >= 100 && ' ✅'}
            </span>
          </div>
          {data.activity.porcentaje_vendido < 100 && (
            <div className="info-item" style={{gridColumn: '1 / -1'}}>
              <div style={{
                background: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: '8px',
                padding: '10px',
                color: '#856404',
                fontSize: '14px'
              }}>
                ⚠️ El sorteo automático solo estará disponible cuando se vendan todos los boletos (100%)
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="numbers-grid">
        {data.winners_by_number.map((item, index) => (
          <div 
            key={item.numero} 
            className={`number-card ${item.winner ? 'has-winner' : 'no-winner'}`}
          >
            <div className="number-header">
              <h3 className="lucky-number">{item.numero}</h3>
              <span className={`status-badge ${item.winner ? 'winner' : 'available'}`}>
                {item.winner ? '👑 Ganador' : '🎯 Disponible'}
              </span>
            </div>

            {item.winner ? (
              <div className="winner-info">
                <div className="winner-details">
                  <h4>🏆 {item.winner.order?.nombre_cliente}</h4>
                  <p><strong>Pedido:</strong> #{item.winner.order?.numero_pedido}</p>
                  <p><strong>Email:</strong> {item.winner.order?.email_cliente}</p>
                  <p><strong>Teléfono:</strong> {item.winner.order?.telefono_cliente}</p>
                  <p><strong>Fecha Sorteo:</strong> {new Date(item.winner.fecha_sorteo).toLocaleString()}</p>
                  {item.winner.notas && (
                    <p><strong>Notas:</strong> {item.winner.notas}</p>
                  )}
                </div>
                <div className="winner-actions">
                  <span className={`announcement-status ${item.winner.anunciado_en_instagram ? 'announced' : 'pending'}`}>
                    {item.winner.anunciado_en_instagram ? '📱 Anunciado en IG' : '⏳ Pendiente anuncio'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="no-winner-info">
                <p>Sin ganador detectado</p>
                <p style={{fontSize: '0.9em', color: '#666', fontStyle: 'italic'}}>
                  Los ganadores se asignan automáticamente cuando los números comprados coinciden con los números premiados.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default LuckyNumbersView;