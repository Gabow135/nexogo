import React, { useState, useEffect } from 'react';
import { DashboardStats } from '../types';
import './AdminDashboard.css';

// Mock data - replace with actual API calls
const mockStats: DashboardStats = {
  total_activities: 12,
  active_activities: 4,
  total_orders: 1250,
  pending_orders: 23,
  total_revenue: 15420.50,
  total_users: 890,
  activities_completed_today: 2,
  revenue_today: 850.00
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: string;
    color: string;
    trend?: string;
  }> = ({ title, value, icon, color, trend }) => (
    <div className="stat-card">
      <div className="stat-header">
        <span className={`stat-icon ${color}`}>{icon}</span>
        {trend && <span className="stat-trend">{trend}</span>}
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );

  const recentActivities = [
    { id: 1, action: 'Nueva actividad creada', item: 'iPhone 15 Pro Max', time: '2 min ago', type: 'create' },
    { id: 2, action: 'Pago verificado', item: 'Orden #197605', time: '5 min ago', type: 'payment' },
    { id: 3, action: 'Actividad completada', item: 'MacBook Pro M3', time: '1 hora ago', type: 'complete' },
    { id: 4, action: 'Nuevo ganador', item: 'AirPods Pro', time: '2 horas ago', type: 'winner' },
    { id: 5, action: 'Orden cancelada', item: 'Orden #197590', time: '3 horas ago', type: 'cancel' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return '➕';
      case 'payment': return '💰';
      case 'complete': return '✅';
      case 'winner': return '🏆';
      case 'cancel': return '❌';
      default: return '📋';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'create': return 'blue';
      case 'payment': return 'green';
      case 'complete': return 'purple';
      case 'winner': return 'gold';
      case 'cancel': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">
          Panel de control y estadísticas generales
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Actividades"
          value={stats.total_activities}
          icon="🎯"
          color="blue"
          trend="↗️ +2"
        />
        <StatCard
          title="Actividades Activas"
          value={stats.active_activities}
          icon="⚡"
          color="green"
          trend="↗️ +1"
        />
        <StatCard
          title="Órdenes Totales"
          value={stats.total_orders.toLocaleString()}
          icon="📋"
          color="purple"
          trend="↗️ +45"
        />
        <StatCard
          title="Órdenes Pendientes"
          value={stats.pending_orders}
          icon="⏳"
          color="orange"
          trend="↘️ -5"
        />
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(stats.total_revenue)}
          icon="💰"
          color="green"
          trend="↗️ +12%"
        />
        <StatCard
          title="Total Usuarios"
          value={stats.total_users.toLocaleString()}
          icon="👥"
          color="blue"
          trend="↗️ +28"
        />
        <StatCard
          title="Completadas Hoy"
          value={stats.activities_completed_today}
          icon="✅"
          color="purple"
        />
        <StatCard
          title="Ingresos Hoy"
          value={formatCurrency(stats.revenue_today)}
          icon="📈"
          color="gold"
        />
      </div>

      <div className="dashboard-content">
        {/* Recent Activities */}
        <div className="admin-card">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <span className={`activity-icon ${getActivityColor(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </span>
                <div className="activity-details">
                  <div className="activity-text">
                    <strong>{activity.action}</strong> - {activity.item}
                  </div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="admin-card">
          <h3>Acciones Rápidas</h3>
          <div className="quick-actions">
            <button className="action-btn blue">
              <span className="action-icon">➕</span>
              <span>Nueva Actividad</span>
            </button>
            <button className="action-btn green">
              <span className="action-icon">💰</span>
              <span>Verificar Pagos</span>
            </button>
            <button className="action-btn purple">
              <span className="action-icon">🏆</span>
              <span>Sortear Actividad</span>
            </button>
            <button className="action-btn orange">
              <span className="action-icon">📊</span>
              <span>Ver Reportes</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="admin-card">
          <h3>Estado del Sistema</h3>
          <div className="system-status">
            <div className="status-item">
              <span className="status-indicator green"></span>
              <span>Pagos automáticos: Activo</span>
            </div>
            <div className="status-item">
              <span className="status-indicator green"></span>
              <span>Sorteos automáticos: Activo</span>
            </div>
            <div className="status-item">
              <span className="status-indicator yellow"></span>
              <span>Notificaciones WhatsApp: Limitado</span>
            </div>
            <div className="status-item">
              <span className="status-indicator green"></span>
              <span>Base de datos: Normal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;