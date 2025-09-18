import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-brand">Nexo Go</h3>
            <p className="footer-description">
              Cumpliendo sueños a través de actividades seguras y transparentes.
            </p>
            <div className="social-links">
              <a
                href="https://instagram.com/nexogoec"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link instagram"
              >
                <span className="social-icon">📸</span>
                Instagram
              </a>
              <a
                href="https://www.tiktok.com/@nextgoec"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link tiktok"
              >
                <span className="social-icon">🎵</span>
                TikTok
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Soporte</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <a
                  href="https://wa.me/593984119133"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link whatsapp-contact"
                >
                  +593 98 411 9133
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <a
                  href="mailto:nexogo@dtiware.com"
                  className="contact-link"
                >
                  nexogo@dtiware.com
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🌐</span>
                <span className="contact-text">www.dtiware.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; 2025 Nexo Go - Dtiware. Todos los derechos reservados.
            </p>
            <div className="footer-legal">
              <Link to="/terminos" className="terms-link">
                Términos y Condiciones
              </Link>
              <span className="separator">•</span>
              <span className="company">Dtiware SAS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;