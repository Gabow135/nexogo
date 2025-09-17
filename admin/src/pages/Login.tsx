import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const { login, loading, isAuthenticated, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    const success = await login(formData.username.trim(), formData.password);
    
    if (!success) {
      setError(authError || 'Credenciales incorrectas. Verifica tu usuario y contraseña.');
      // Clear password on error
      setFormData(prev => ({ ...prev, password: '' }));
    }
  };

  const handleDemoLogin = async (username: string, password: string) => {
    setFormData({ username, password });
    const success = await login(username, password);
    if (!success) {
      setError('Error en el login de demostración');
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="logo">
              <div className="logo-icon">🎯</div>
              <div className="logo-text">
                <h1>Next Go</h1>
                <span>Panel de Administración</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <div className="input-container">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu usuario"
                  disabled={loading}
                  autoComplete="username"
                />
                <span className="input-icon">👤</span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu contraseña"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="login-button"
              disabled={loading || !formData.username.trim() || !formData.password.trim()}
            >
              {loading ? (
                <div className="loading-content">
                  <span className="spinner"></span>
                  Iniciando sesión...
                </div>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <span className="login-arrow">→</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials - HIDDEN FOR PRODUCTION
          <div className="demo-section">
            <div className="demo-header">
              <span className="demo-title">🚀 Credenciales de Demostración</span>
            </div>
            <div className="demo-buttons">
              <button
                type="button"
                className="demo-button"
                onClick={() => handleDemoLogin('admin', 'admin123')}
                disabled={loading}
              >
                <strong>Super Admin</strong>
                <small>admin / admin123</small>
              </button>
              <button
                type="button"
                className="demo-button"
                onClick={() => handleDemoLogin('nexogo', 'nexogo2024')}
                disabled={loading}
              >
                <strong>Admin</strong>
                <small>nexogo / nexogo2024</small>
              </button>
            </div>
          </div>
          */}

          {/* Footer */}
          <div className="login-footer">
            <p>© 2025 Next Go - Dtiware. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;