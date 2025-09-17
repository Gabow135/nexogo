import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const isActive = (path: string) => location.pathname.includes(path);

  const menuItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard', exact: true },
    { path: '/admin/activities', icon: '🎯', label: 'Actividades' },
    { path: '/admin/orders', icon: '📋', label: 'Órdenes' },
    { path: '/admin/winners', icon: '🏆', label: 'Ganadores' },
    { path: '/admin/bank-accounts', icon: '🏦', label: 'Cuentas Bancarias' },
    { path: '/admin/settings', icon: '⚙️', label: 'Configuración' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <Link to="/" className="admin-logo">
            <span className="logo-icon">🎯</span>
            {sidebarOpen && <span className="logo-text">Nexo Go Admin</span>}
          </Link>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                item.exact 
                  ? location.pathname === item.path ? 'active' : ''
                  : isActive(item.path) ? 'active' : ''
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item">
            <span className="nav-icon">🏠</span>
            {sidebarOpen && <span className="nav-label">Ir al Sitio</span>}
          </Link>
          <button className="nav-item logout-btn">
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span className="nav-label">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className={sidebarOpen ? '❮' : '❯'}>☰</span>
          </button>

          <div className="header-actions">
            <button className="header-btn">
              <span>🔔</span>
              <span className="notification-badge">3</span>
            </button>
            <div className="admin-user">
              <span className="user-avatar">👨‍💼</span>
              <span className="user-name">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;