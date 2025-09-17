import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="text-primary">Nexo Go</h3>
            <p>Cumpliendo sueños a través de actividades seguras y transparentes.</p>
            <div className="social-links">
              <a 
                href="https://instagram.com/nexogoec" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                📸 Instagram
              </a>
              <a 
                href="https://tiktok.com/@nexogoec" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                🎵 TikTok
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Soporte</h4>
            <div className="contact-info">
              <p>
                <a 
                  href="https://wa.me/593984119133" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-contact"
                >
                  📱 +593 98 411 9133
                </a>
              </p>
              <p>
                <a href="mailto:nexogo@dtiware.com">
                  ✉️ nexogo@dtiware.com
                </a>
              </p>
              <p>🌐 www.dtiware.com</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Nexo Go - Dtiware. Todos los derechos reservados.</p>
            <div className="footer-legal">
              <span>Dtiware SAS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;