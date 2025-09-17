import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-circle floating">
              <img src="/logo-nexogo.png" alt="Next Go" className="logo-img" />
            </div>
          </Link>
          
          <nav className="nav">
            <button 
              onClick={() => scrollToSection('inicio')} 
              className="nav-link nav-button"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('consultar')} 
              className="nav-link nav-button"
            >
              Consultar Boletos
            </button>
            <Link 
              to="/ganadores" 
              className="nav-link nav-button"
            >
              Ganadores
            </Link>
          </nav>

          <div className="header-actions">
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;