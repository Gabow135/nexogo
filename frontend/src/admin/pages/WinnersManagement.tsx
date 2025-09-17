import React, { useState, useEffect } from 'react';
import { adminWinnersService } from '../../services/api';
import './WinnersManagement.css';

interface Winner {
  id: number;
  activity: {
    id: number;
    nombre: string;
    actividad_numero: string;
    imagen_url: string;
  };
  order: {
    id: number;
    nombre_cliente: string;
    email_cliente: string;
    telefono_cliente: string;
  };
  numero_ganador: string;
  es_numero_premiado: boolean;
  fecha_sorteo: string;
  anunciado_en_instagram: boolean;
  notas?: string;
}

const WinnersManagement: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWinners();
  }, []);

  const loadWinners = async () => {
    try {
      setLoading(true);
      const winnersData = await adminWinnersService.getAll();
      setWinners(winnersData);
    } catch (error) {
      console.error('Error loading winners:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsAnnounced = async (winnerId: number) => {
    try {
      await adminWinnersService.markAsAnnounced(winnerId);
      setWinners(prev => prev.map(winner => 
        winner.id === winnerId 
          ? { ...winner, anunciado_en_instagram: true }
          : winner
      ));
    } catch (error) {
      console.error('Error marking as announced:', error);
    }
  };

  const deleteWinner = async (winnerId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este ganador?')) {
      try {
        await adminWinnersService.delete(winnerId);
        setWinners(prev => prev.filter(winner => winner.id !== winnerId));
      } catch (error) {
        console.error('Error deleting winner:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="winners-management">
        <div className="loading">Cargando ganadores...</div>
      </div>
    );
  }

  return (
    <div className="winners-management">
      <div className="page-header">
        <h1>Gestión de Ganadores</h1>
        <p className="page-subtitle">
          Administra todos los ganadores del sistema
        </p>
      </div>

      {winners.length === 0 ? (
        <div className="admin-card">
          <div className="empty-state">
            <h3>No hay ganadores registrados</h3>
            <p>Los ganadores aparecerán aquí una vez que se realicen los sorteos.</p>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="winners-table">
            <table>
              <thead>
                <tr>
                  <th>Actividad</th>
                  <th>Número Ganador</th>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Fecha Sorteo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {winners.map((winner) => (
                  <tr key={winner.id}>
                    <td>
                      <div className="activity-info">
                        <img 
                          src={winner.activity.imagen_url} 
                          alt={winner.activity.nombre}
                          className="activity-thumb"
                        />
                        <div>
                          <div className="activity-name">{winner.activity.nombre}</div>
                          <div className="activity-number">{winner.activity.actividad_numero}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="winning-number">{winner.numero_ganador}</span>
                    </td>
                    <td>
                      <div className="client-info">
                        <div className="client-name">{winner.order.nombre_cliente}</div>
                        <div className="order-id">Orden #{winner.order.id}</div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div className="email">{winner.order.email_cliente}</div>
                        <div className="phone">{winner.order.telefono_cliente}</div>
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        {formatDate(winner.fecha_sorteo)}
                      </div>
                    </td>
                    <td>
                      <div className="status-cell">
                        <span className={`status-badge ${winner.anunciado_en_instagram ? 'announced' : 'pending'}`}>
                          {winner.anunciado_en_instagram ? '📢 Anunciado' : '⏳ Pendiente'}
                        </span>
                        {winner.es_numero_premiado && (
                          <span className="lucky-badge">🍀 Número Suerte</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        {!winner.anunciado_en_instagram && (
                          <button 
                            className="action-btn green"
                            onClick={() => markAsAnnounced(winner.id)}
                            title="Marcar como anunciado"
                          >
                            📢
                          </button>
                        )}
                        <button 
                          className="action-btn red"
                          onClick={() => deleteWinner(winner.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinnersManagement;