import React, { useState, useEffect } from 'react';
import { Rifa } from '../../types';
import { ActivityFormData } from '../types';
import api from '../../services/api';
import './ActivitiesManagement.css';

const ActivitiesManagement: React.FC = () => {
  const [activities, setActivities] = useState<Rifa[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Rifa | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/activities');
      setActivities(response.data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState<ActivityFormData>({
    nombre: '',
    descripcion: '',
    imagen_url: '',
    precio_boleto: 1.00,
    total_boletos: 100,
    actividad_numero: '',
    fecha_inicio: '',
    fecha_fin: '',
    sorteo_automatico: true,
    numeros_premiados: []
  });

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      imagen_url: '',
      precio_boleto: 1.00,
      total_boletos: 100,
      actividad_numero: '',
      fecha_inicio: '',
      fecha_fin: '',
      sorteo_automatico: true,
      numeros_premiados: []
    });
    setEditingActivity(null);
  };

  const openModal = (activity?: Rifa) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        nombre: activity.nombre,
        descripcion: activity.descripcion,
        imagen_url: activity.imagen_url,
        precio_boleto: typeof activity.precio_boleto === 'string' ? parseFloat(activity.precio_boleto) : activity.precio_boleto,
        total_boletos: activity.total_boletos,
        actividad_numero: activity.actividad_numero,
        fecha_inicio: activity.fecha_inicio,
        fecha_fin: activity.fecha_fin,
        sorteo_automatico: activity.sorteo_automatico,
        numeros_premiados: activity.numeros_premiados || []
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingActivity) {
        // Update existing activity
        await api.put(`/admin/activities/${editingActivity.id}`, formData);
      } else {
        // Create new activity
        await api.post('/admin/activities', formData);
      }

      loadActivities();
      closeModal();
    } catch (error) {
      console.error('Error saving activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const drawActivity = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas realizar el sorteo? Esta acción no se puede deshacer.')) {
      try {
        setLoading(true);
        await api.post(`/admin/activities/${id}/draw`);
        loadActivities();
      } catch (error) {
        console.error('Error drawing activity:', error);
        alert('Error al realizar el sorteo');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const deleteActivity = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      try {
        setLoading(true);
        await api.delete(`/admin/activities/${id}`);
        loadActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Error al eliminar la actividad');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'activa': return 'green';
      case 'sorteo_en_curso': return 'orange';
      case 'finalizada': return 'blue';
      case 'cancelada': return 'red';
      default: return 'gray';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'activa': return 'Activa';
      case 'sorteo_en_curso': return 'En Sorteo';
      case 'finalizada': return 'Finalizada';
      case 'cancelada': return 'Cancelada';
      default: return estado;
    }
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  return (
    <div className="activities-management">
      <div className="page-header">
        <h1>Gestión de Actividades</h1>
        <p className="page-subtitle">
          Administra todas las actividades del sistema
        </p>
      </div>

      <div className="activities-actions">
        <button 
          className="btn btn-primary"
          onClick={() => openModal()}
        >
          ➕ Nueva Actividad
        </button>
      </div>

      <div className="admin-card">
        <div className="activities-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Número</th>
                <th>Precio</th>
                <th>Progreso</th>
                <th>Números Suerte</th>
                <th>Ganador</th>
                <th>Estado</th>
                <th>Fechas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>#{activity.id}</td>
                  <td>
                    <div className="activity-info">
                      <img 
                        src={activity.imagen_url} 
                        alt={activity.nombre}
                        className="activity-thumb"
                      />
                      <div>
                        <div className="activity-name">{activity.nombre}</div>
                        <div className="activity-desc">{activity.descripcion.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="activity-number">{activity.actividad_numero}</span>
                  </td>
                  <td>{formatCurrency(activity.precio_boleto)}</td>
                  <td>
                    <div className="progress-cell">
                      <div className="progress-bar-small">
                        <div 
                          className="progress-fill-small"
                          style={{ width: `${activity.porcentaje_vendido}%` }}
                        />
                      </div>
                      <div className="progress-text">
                        {activity.boletos_vendidos}/{activity.total_boletos} 
                        ({(typeof activity.porcentaje_vendido === 'string' ? parseFloat(activity.porcentaje_vendido) : activity.porcentaje_vendido).toFixed(1)}%)
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="lucky-numbers-cell">
                      {activity.estado === 'sorteo_en_curso' && activity.numeros_premiados && activity.numeros_premiados.length > 0 ? (
                        <div className="lucky-numbers">
                          {activity.numeros_premiados.slice(0, 3).map((numero, index) => (
                            <span key={index} className="lucky-number">{numero}</span>
                          ))}
                          {activity.numeros_premiados.length > 3 && (
                            <span className="more-numbers">+{activity.numeros_premiados.length - 3}</span>
                          )}
                        </div>
                      ) : activity.numeros_premiados && activity.numeros_premiados.length > 0 ? (
                        <span className="numbers-ready">{activity.numeros_premiados.length} números</span>
                      ) : (
                        <span className="no-numbers">-</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="winner-cell">
                      {(activity as any).main_winner ? (
                        <div className="winner-info">
                          <div className="winning-number">#{(activity as any).main_winner.numero_ganador}</div>
                          <div className="winner-name">{(activity as any).main_winner.winner_name}</div>
                        </div>
                      ) : activity.estado === 'sorteo_en_curso' || activity.estado === 'finalizada' ? (
                        <span className="no-winner">Pendiente</span>
                      ) : (
                        <span className="no-winner">-</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(activity.estado)}`}>
                      {getStatusText(activity.estado)}
                    </span>
                  </td>
                  <td>
                    <div className="date-range">
                      <div>{new Date(activity.fecha_inicio).toLocaleDateString()}</div>
                      <div>{new Date(activity.fecha_fin).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="action-btn blue"
                        onClick={() => openModal(activity)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn red"
                        onClick={() => deleteActivity(activity.id)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                      {activity.estado === 'activa' && (typeof activity.porcentaje_vendido === 'string' ? parseFloat(activity.porcentaje_vendido) : activity.porcentaje_vendido) >= 100 && (
                        <button 
                          className="action-btn green"
                          onClick={() => drawActivity(activity.id)}
                          title="Sortear"
                        >
                          🎲
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingActivity ? 'Editar Actividad' : 'Nueva Actividad'}</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="activity-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: iPhone 15 Pro Max"
                  />
                </div>
                <div className="form-group">
                  <label>Número de Actividad *</label>
                  <input
                    type="text"
                    name="actividad_numero"
                    value={formData.actividad_numero}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: #37"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción *</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Describe el premio y sus características..."
                />
              </div>

              <div className="form-group">
                <label>URL de Imagen *</label>
                <input
                  type="url"
                  name="imagen_url"
                  value={formData.imagen_url}
                  onChange={handleInputChange}
                  required
                  placeholder="https://..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio por Boleto *</label>
                  <input
                    type="number"
                    name="precio_boleto"
                    value={formData.precio_boleto}
                    onChange={handleInputChange}
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total de Boletos *</label>
                  <input
                    type="number"
                    name="total_boletos"
                    value={formData.total_boletos}
                    onChange={handleInputChange}
                    min="10"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha Inicio *</label>
                  <input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha Fin *</label>
                  <input
                    type="date"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="sorteo_automatico"
                    checked={formData.sorteo_automatico}
                    onChange={handleInputChange}
                  />
                  Sorteo automático al 100%
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : editingActivity ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesManagement;