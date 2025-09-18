<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instrucciones de Pago - Nexogo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 30px 20px;
        }

        .logo {
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }

        .tagline {
            font-size: 14px;
            opacity: 0.9;
        }

        .content {
            padding: 30px;
        }

        .greeting {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
            text-align: center;
        }

        .order-number {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }

        .activity-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }

        .activity-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }

        .activity-details {
            color: #666;
            margin-bottom: 5px;
        }

        .price-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .price-label {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }

        .price-amount {
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
        }

        .payment-method {
            margin: 20px 0;
            padding: 15px;
            background: #e8f4f8;
            border-radius: 8px;
        }

        .payment-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }

        .personal-info {
            margin: 30px 0;
        }

        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
        }

        .info-item {
            margin-bottom: 8px;
            color: #666;
        }

        .instructions-section {
            margin: 30px 0;
            padding: 20px;
            background: #fff3cd;
            border: 2px solid #ffeaa7;
            border-radius: 8px;
        }

        .instructions-title {
            font-size: 20px;
            font-weight: bold;
            color: #8b6914;
            margin-bottom: 20px;
            text-align: center;
        }

        .instruction-step {
            margin-bottom: 15px;
            color: #333;
            line-height: 1.5;
        }

        .step-number {
            font-weight: bold;
            color: #8b6914;
        }

        .highlight {
            font-weight: bold;
            color: #d32f2f;
        }

        .whatsapp-number {
            font-weight: bold;
            background: #25d366;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
        }

        .bank-info {
            background: #e3f2fd;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2196f3;
        }

        .bank-logo {
            font-size: 24px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 15px;
            text-align: center;
            background: #fff;
            padding: 10px;
            border-radius: 5px;
            display: inline-block;
            width: 100%;
        }

        .bank-details {
            margin-bottom: 10px;
            color: #333;
        }

        .bank-label {
            font-weight: 600;
            color: #1976d2;
        }

        .countdown-warning {
            background: #ffebee;
            border: 2px solid #f44336;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }

        .countdown-text {
            color: #d32f2f;
            font-weight: bold;
            font-size: 16px;
        }

        .footer-section {
            background: #333;
            color: white;
            padding: 30px;
            text-align: center;
        }

        .footer-text {
            margin-bottom: 20px;
            line-height: 1.6;
            color: white;
        }

        .social-accounts {
            margin: 20px 0;
        }

        .social-account {
            display: inline-block;
            margin: 10px 20px;
        }

        .social-name {
            display: block;
            font-weight: 600;
            margin-bottom: 5px;
            color: white;
        }

        .social-handle {
            color: #ccc;
            font-size: 14px;
        }

        .final-message {
            margin-top: 20px;
            font-size: 16px;
            font-weight: 600;
            color: #4ecdc4;
        }

        .terms-link {
            color: #7fb3d3;
            text-decoration: none;
            font-size: 14px;
            margin-top: 20px;
            display: inline-block;
        }

        .terms-link:hover {
            color: #9fc5e8;
            text-decoration: underline;
        }

        @media (max-width: 480px) {
            .container {
                margin: 10px;
                border-radius: 5px;
            }

            .content {
                padding: 20px;
            }

            .price-section {
                flex-direction: column;
                gap: 10px;
            }

            .bank-logo {
                font-size: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">NEXOGO</div>
            <div class="tagline">De los sueños a la realidad.</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Hola {{ $order->nombre_cliente }}, ¡Gracias por tu pedido!
            </div>

            <div class="order-number">
                Número de Pedido #{{ $order->numero_pedido }}
            </div>

            <!-- Activity Info -->
            <div class="activity-info">
                <div class="activity-title">{{ $activity->nombre }}</div>
                <div class="activity-details">{{ $activity->descripcion }}</div>
                <div class="activity-details">Actividad #{{ $activity->id }}</div>
                <div class="activity-details">Cantidad: {{ $order->cantidad_boletos }}</div>
            </div>

            <!-- Price -->
            <div class="price-section">
                <div class="price-label">Total</div>
                <div class="price-amount">${{ number_format($order->total_pagado, 2) }} </div>
            </div>

            <!-- Payment Method -->
            <div class="payment-method">
                <div class="payment-title">Método de pago</div>
                <div>{{ ucfirst($order->metodo_pago) }}</div>
            </div>

            <!-- Personal Info -->
            <div class="personal-info">
                <div class="section-title">Datos Personales</div>
                <div class="info-item">{{ $order->nombre_cliente }}</div>
                <div class="info-item">{{ $order->direccion_cliente }}</div>
                <div class="info-item">{{ $order->telefono_cliente }}</div>
                <div class="info-item">{{ $order->cedula_ruc }}</div>
            </div>

            <!-- Payment Instructions -->
            <div class="instructions-section">
                <div class="instructions-title">Instrucciones de Pago</div>

                <div class="instruction-step">
                    <span class="step-number">1.</span> Guarda tu pedido: Anota o realiza una captura del <strong>NÚMERO DE PEDIDO</strong>.
                </div>

                <div class="instruction-step">
                    <span class="step-number">2.</span> Realiza la transferencia: Transfiere el monto total y envía el <strong>COMPROBANTE</strong> junto con el <strong>NÚMERO DE PEDIDO: {{ $order->numero_pedido }}</strong> solo por <strong>WHATSAPP</strong> al <span class="whatsapp-number">+593 98 411 9133</span> en un <strong>MÁXIMO DE 1 HORA</strong>, o el pedido será <span class="highlight">CANCELADO SIN REEMBOLSO</span>.
                    <br><small>Si ya enviaste el comprobante y no hemos respondido, <strong>no vuelvas a enviar mensajes adicionales</strong>: respondemos en orden de llegada.</small>
                </div>

                <div class="instruction-step">
                    <span class="step-number">3.</span> Una vez verificado el pago, recibirás tus <strong>NÚMEROS</strong> por correo electrónico.
                    <br>Ten en cuenta que las transferencias interbancarias pueden tardar en acreditarse.. También puedes consultar tus números en la página web, en la sección <strong>"Consulta tus números"</strong>.
                </div>
            </div>

            <!-- Bank Information -->
            @if(count($bankAccounts) > 0)
            <div class="section-title">Números de Cuenta:</div>
            @foreach($bankAccounts as $account)
            <div class="bank-info">
                <div class="bank-logo">🏦 {{ strtoupper($account->banco) }}</div>

                <div class="bank-details">
                    <span class="bank-label">{{ ucfirst($account->tipo_cuenta) }}:</span> #{{ $account->numero_cuenta }}
                </div>
                <div class="bank-details">
                    <span class="bank-label">Titular:</span> {{ $account->titular }}
                </div>
                <div class="bank-details">
                    <span class="bank-label">RUC:</span> {{ $account->cedula_ruc }}
                </div>
                <div class="bank-details">
                    <span class="bank-label">Correo:</span> {{ $account->email_contacto }}
                </div>
            </div>
            @if(!$loop->last)
            <div style="margin: 20px 0;"></div>
            @endif
            @endforeach
            @endif

            <!-- Countdown Warning -->
            <div class="countdown-warning">
                <div class="countdown-text">
                    ⏰ Recuerda: Tienes máximo 1 hora para enviar tu comprobante
                </div>
            </div>
        </div>

        <!-- Footer Section -->
        <div class="footer-section">
            <div class="footer-text">
                Las actividades se jugarán una vez vendidos todos los números. Anunciaremos al ganador del <strong>{{ $activity->premio_principal }}</strong> mediante un live en nuestras cuentas de Instagram oficiales. ¡Síguenos para no perdértelo!
            </div>

            <div class="social-accounts">
                <div class="social-account">
                    <div class="social-name">NexoGo EC</div>
                    <div class="social-handle">@nexogoEc</div>
                </div>
            </div>

            <div class="final-message">¡Te deseamos mejor de las suertes!</div>

            <a href="https://nexogo.org/terminos" class="terms-link">Términos y Condiciones</a>
        </div>
    </div>
</body>
</html>