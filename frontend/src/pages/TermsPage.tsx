import React from 'react';
import './TermsPage.css';

const TermsPage: React.FC = () => {
  return (
    <div className="terms-page">
      <div className="container">
        <div className="terms-header">
          <h1>Términos y Condiciones del Sorteo</h1>
        </div>

        <div className="terms-content">
          <div className="terms-section">
            <div className="term-item">
              <span className="term-number">1.</span>
              <div className="term-text">
                <strong>Duración del sorteo:</strong> El sorteo se llevará a cabo una vez se haya completado la venta total de los números disponibles.
              </div>
            </div>

            <div className="term-item">
              <span className="term-number">2.</span>
              <div className="term-text">
                <strong>Elegibilidad:</strong> La participación está abierta a cualquier persona residente en Ecuador, sin restricción de edad.
              </div>
            </div>

            <div className="term-item">
              <span className="term-number">3.</span>
              <div className="term-text">
                <strong>Selección del ganador:</strong> El ganador será elegido de manera aleatoria.
              </div>
            </div>

            <div className="term-item">
              <span className="term-number">4.</span>
              <div className="term-text">
                <strong>Entrega del premio:</strong> El premio será entregado a nombre del ganador o, en caso de ser menor de edad, a su representante legal, cumpliendo con todos los procesos de ley.
              </div>
            </div>

            <div className="term-item">
              <span className="term-number">5.</span>
              <div className="term-text">
                <strong>Notificación del ganador:</strong> El ganador será contactado a través de los datos proporcionados al participar. Los resultados también serán publicados en nuestras redes sociales y medios oficiales.
              </div>
            </div>

            <div className="term-item">
              <span className="term-number">6.</span>
              <div className="term-text">
                <strong>Propiedad intelectual:</strong> Todo el contenido relacionado con este sorteo está protegido por derechos de autor y demás derechos de propiedad intelectual.
              </div>
            </div>

            <div className="term-item">
              <span className="term-number">7.</span>
              <div className="term-text">
                <strong>Condición general:</strong> Para la realización del sorteo es requisito indispensable que se vendan todos los números participantes.
              </div>
            </div>

            <div className="term-item">
              <span className="term-number">8.</span>
              <div className="term-text">
                <strong>Requisitos adicionales para los ganadores:</strong>
                <ul className="sub-terms">
                  <li>
                    <strong>8.1 Premio mayor:</strong> Será entregado personalmente en la ciudad del ganador o enviado por courier (aplican restricciones). El ganador acepta ser grabado en video durante la entrega.
                  </li>
                  <li>
                    <strong>8.2 Premios económicos o especiales:</strong> Se entregarán de manera inmediata vía transferencia, efectivo o físicamente, una vez que los técnicos verifiquen la validez del número ganador.
                  </li>
                  <li>
                    <strong>8.2.1 Premio especial:</strong> El ganador deberá enviar un video mencionando a Nexo go, indicando el sorteo, mostrando el número ganador y mencionando el premio obtenido.
                  </li>
                  <li>
                    <strong>8.2.3 Promociones adicionales:</strong> Las promociones anunciadas en redes sociales y canales oficiales tendrán vigencia únicamente desde el momento de su publicación hasta las 23h59 del mismo día.
                  </li>
                </ul>
              </div>
            </div>

            <div className="term-item">
              <span className="term-number">9.</span>
              <div className="term-text">
                <strong>Asignación de números:</strong> Los números serán generados y asignados por el sistema de manera única y aleatoria para cada participante.
              </div>
            </div>

            <div className="term-item">
              <span className="term-number">10.</span>
              <div className="term-text">
                <strong>Aceptación de términos:</strong> La participación en el sorteo implica la aceptación total de estos términos y condiciones.
              </div>
            </div>

            <div className="term-item">
              <span className="term-number">11.</span>
              <div className="term-text">
                <strong>Pagos por transferencia:</strong> El participante contará con un plazo máximo de 1 hora para realizar el pago y enviar el comprobante al WhatsApp oficial de Nexogo. En caso de incumplimiento, el pedido será cancelado y no se permitirá reembolso bajo ninguna circunstancia.
              </div>
            </div>
          </div>

          <div className="contact-section">
            <div className="contact-divider">⸻</div>
            <div className="contact-info">
              <p>📩 Para cualquier duda o comentario sobre estos términos y condiciones, contáctanos a través de:</p>
              <div className="contact-details">
                <a href="mailto:nexogo@dtiware.com" className="contact-link">
                  ✉️ nexogo@dtiware.com
                </a>
                <a href="https://wa.me/593984119133" className="contact-link" target="_blank" rel="noopener noreferrer">
                  📱 WhatsApp +593 98 411 9133
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;