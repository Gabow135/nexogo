import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './WinnersManagement.css';

interface Winner {
  id: number;
  activity_id: number;
  order_id: number;
  numero_ganador: string;
  es_numero_premiado: boolean;
  fecha_sorteo: string;
  anunciado_en_instagram: boolean;
  notas?: string;
  activity: {
    id: number;
    nombre: string;
    actividad_numero: string;
    imagen_url: string;
  };
  order: {
    id: number;
    numero_pedido: string;
    nombre_cliente: string;
    email_cliente: string;
    telefono_cliente: string;
  };
}

const WinnersManagement: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWinners();
  }, []);

  const loadWinners = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWinners();
      setWinners(data);
      setError(null);
    } catch (error) {
      console.error('Error loading winners:', error);
      setError('Error al cargar los ganadores');
    } finally {
      setLoading(false);
    }
  };

  const toggleInstagramAnnouncement = async (id: number) => {
    try {
      await apiService.toggleInstagramAnnouncement(id.toString());
      // Refresh winners after update
      await loadWinners();
    } catch (error) {
      console.error('Error toggling instagram announcement:', error);
      setError('Error al actualizar el anuncio');
    }
  };

  const filteredWinners = winners.filter(winner => {
    const matchesFilter = filter === 'all' ||
      (filter === 'principales' && !winner.es_numero_premiado) ||
      (filter === 'premiados' && winner.es_numero_premiado) ||
      (filter === 'anunciados' && winner.anunciado_en_instagram) ||
      (filter === 'pendientes' && !winner.anunciado_en_instagram);

    const matchesSearch =
      winner.numero_ganador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      winner.activity.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      winner.order.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      winner.order.email_cliente.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getWinnerCounts = () => {
    return {
      all: winners.length,
      principales: winners.filter(w => !w.es_numero_premiado).length,
      premiados: winners.filter(w => w.es_numero_premiado).length,
      anunciados: winners.filter(w => w.anunciado_en_instagram).length,
      pendientes: winners.filter(w => !w.anunciado_en_instagram).length,
    };
  };

  const counts = getWinnerCounts();

  if (loading) {
    return (
      <div className="winners-management">
        <div className="page-header">
          <h1>Gestión de Ganadores</h1>
          <p className="page-subtitle">Cargando ganadores...</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="winners-management">
      <div className="page-header">
        <h1>Gestión de Ganadores</h1>
        <p className="page-subtitle">
          Administra todos los ganadores y anuncios de Instagram
        </p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={loadWinners} className="retry-btn">
            Reintentar
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="admin-card">
        <div className="winners-filters">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todos ({counts.all})
            </button>
            <button
              className={`filter-tab ${filter === 'principales' ? 'active' : ''}`}
              onClick={() => setFilter('principales')}
            >
              🏆 Principales ({counts.principales})
            </button>
            <button
              className={`filter-tab ${filter === 'premiados' ? 'active' : ''}`}
              onClick={() => setFilter('premiados')}
            >
              🎯 Premiados ({counts.premiados})
            </button>
            <button
              className={`filter-tab ${filter === 'anunciados' ? 'active' : ''}`}
              onClick={() => setFilter('anunciados')}
            >
              ✅ Anunciados ({counts.anunciados})
            </button>
            <button
              className={`filter-tab ${filter === 'pendientes' ? 'active' : ''}`}
              onClick={() => setFilter('pendientes')}
            >
              ⏳ Pendientes ({counts.pendientes})
            </button>
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por número, actividad o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>

      {/* Winners Table */}
      <div className="admin-card">
        <div className="winners-table">
          <table>
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Tipo</th>
                <th>Número Ganador</th>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Fecha Sorteo</th>
                <th>Instagram</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredWinners.map((winner) => (
                <tr key={winner.id}>
                  <td>
                    <div className="activity-info">
                      <strong>{winner.activity.nombre}</strong>
                      <small>{winner.activity.actividad_numero}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`numero-ganador ${winner.es_numero_premiado ? 'numero-premiado' : 'premio-principal'}`}>
                      {winner.es_numero_premiado ? '🎯' : '🏆'}
                    </span>
                  </td>
                  <td>
                    <span className={`numero-ganador ${winner.es_numero_premiado ? 'numero-premiado' : 'premio-principal'}`}>
                      {winner.numero_ganador}
                    </span>
                  </td>
                  <td>
                    <div className="client-info">
                      <div className="client-name">{winner.order.nombre_cliente}</div>
                      <div className="client-email">{winner.order.email_cliente}</div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{winner.order.telefono_cliente}</div>
                    </div>
                  </td>
                  <td>
                    <div className="date-info">
                      {new Date(winner.fecha_sorteo).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <span className={`status ${winner.anunciado_en_instagram ? 'announced' : 'pending'}`}>
                      {winner.anunciado_en_instagram ? '✅ Anunciado' : '⏳ Pendiente'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        onClick={() => toggleInstagramAnnouncement(winner.id)}
                        className={`btn-toggle ${winner.anunciado_en_instagram ? 'announced' : 'not-announced'}`}
                        title={winner.anunciado_en_instagram ? 'Marcar como Pendiente' : 'Anunciar en Instagram'}
                      >
                        {winner.anunciado_en_instagram ? '📱' : '📢'}
                      </button>
                      <a
                        href={`https://wa.me/${winner.order.telefono_cliente.replace(/\D/g, '')}`}
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

      {/* Summary */}
      <div className="winners-summary">
        <div className="summary-card">
          <h4>📊 Resumen de Ganadores</h4>
          <p><strong>Total Ganadores:</strong> {winners.length}</p>
          <p><strong>Premios Principales:</strong> {counts.principales}</p>
          <p><strong>Números Premiados:</strong> {counts.premiados}</p>
          <p><strong>Anunciados en Instagram:</strong> {counts.anunciados}</p>
          <p><strong>Pendientes de Anunciar:</strong> {counts.pendientes}</p>
        </div>
      </div>
    </div>
  );
};

export default WinnersManagement;