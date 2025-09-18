<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pago - Nexogo</title>
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
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 25px;
            border-left: 4px solid #667eea;
        }

        .activity-title {
            font-size: 20px;
            font-weight: 700;
            color: #333;
            margin-bottom: 12px;
        }

        .activity-details {
            color: #666;
            margin-bottom: 6px;
            font-size: 14px;
        }

        .activity-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-top: 10px;
        }

        .meta-item {
            background: rgba(255,255,255,0.7);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 13px;
        }

        .meta-label {
            font-weight: 600;
            color: #667eea;
        }

        .price-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px 0;
            padding: 18px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            min-height: 60px;
        }

        .price-label {
            font-size: 20px;
            font-weight: 600;
            color: white;
            display: flex;
            align-items: center;
        }

        .price-amount {
            font-size: 32px;
            font-weight: 900;
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            letter-spacing: 1px;
            display: flex;
            align-items: center;
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
            margin: 25px 0;
            background: #f8f9fa;
            padding: 18px;
            border-radius: 12px;
            border-left: 4px solid #4ecdc4;
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .info-item {
            background: white;
            padding: 10px 12px;
            border-radius: 8px;
            color: #666;
            font-size: 14px;
            border-left: 3px solid #4ecdc4;
        }

        .tickets-section {
            margin: 30px 0;
        }

        .tickets-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
            max-width: 100%;
        }

        .ticket {
            background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
            color: #333;
            padding: 12px 16px;
            border-radius: 12px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 2px 10px rgba(78, 205, 196, 0.3);
            border: 2px solid rgba(255,255,255,0.2);
            position: relative;
            flex: 0 0 auto;
            min-width: 80px;
        }

        .ticket::before {
            content: '';
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 1px;
            background: rgba(0,0,0,0.2);
        }

        .ticket::after {
            content: '';
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 1px;
            background: rgba(0,0,0,0.2);
        }

        .additional-info {
            margin: 30px 0;
        }

        .info-text {
            margin-bottom: 15px;
            color: #333;
            line-height: 1.6;
        }

        .winning-numbers {
            margin: 20px 0;
            padding: 20px;
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            border-radius: 15px;
            border: none;
        }

        .winning-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-top: 15px;
        }

        .winning-number-item {
            background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
            color: white;
            font-size: 14px;
            font-weight: bold;
            padding: 8px 12px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
            border: 2px solid rgba(255,255,255,0.2);
            flex: 0 0 auto;
            min-width: 70px;
        }

        .social-section {
            background: #333;
            color: white;
            padding: 30px;
            text-align: center;
        }

        .social-text {
            margin-bottom: 20px;
            line-height: 1.6;
            color: white;
            font-size: 16px;
        }

        .social-accounts {
            margin: 20px 0;
        }

        .social-account {
            display: inline-block;
            margin: 10px 20px;
        }

        .social-icon {
            width: 30px;
            height: 30px;
            margin-bottom: 10px;
        }

        .social-name {
            display: block;
            font-weight: 600;
            margin-bottom: 5px;
            color: white;
            font-size: 18px;
        }

        .social-handle {
            color: #ccc;
            font-size: 14px;
        }

        .footer-text {
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

            .activity-meta {
                grid-template-columns: 1fr;
                gap: 8px;
            }

            .info-grid {
                grid-template-columns: 1fr;
                gap: 8px;
            }

            .tickets-grid {
                gap: 8px;
            }

            .ticket {
                padding: 10px 12px;
                font-size: 14px;
                min-width: 70px;
            }

            .winning-list {
                gap: 8px;
            }

            .winning-number-item {
                padding: 6px 10px;
                font-size: 12px;
                min-width: 60px;
            }

            .price-section {
                flex-direction: column;
                gap: 15px;
                text-align: center;
                padding: 20px;
            }

            .price-label {
                font-size: 18px;
            }

            .price-amount {
                font-size: 28px;
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
                Hola {{ $order->nombre_cliente }}, ¡Gracias por tu compra!
            </div>

            <div class="order-number">
                Número de Pedido #{{ $order->numero_pedido }}
            </div>

            <!-- Activity Info -->
            <div class="activity-info">
                <div class="activity-title">{{ $activity->nombre }}</div>
                <div class="activity-details">{{ $activity->descripcion }}</div>
                <div class="activity-meta">
                    <div class="meta-item">
                        <span class="meta-label">Actividad:</span> #{{ $activity->id }}
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Cantidad:</span> {{ $order->cantidad_boletos }}
                    </div>
                </div>
            </div>

            <!-- Price -->
            <div class="price-section">
                <div class="price-label">Total</div>
                <div class="price-amount">${{ number_format($order->total_pagado, 2) }}</div>
            </div>

            <!-- Payment Method -->
            <div class="payment-method">
                <div class="payment-title">Método de pago</div>
                <div>{{ ucfirst($order->metodo_pago) }}</div>
            </div>

            <!-- Personal Info -->
            <div class="personal-info">
                <div class="section-title">Datos Personales</div>
                <div class="info-grid">
                    <div class="info-item">👤 {{ $order->nombre_cliente }}</div>
                    <div class="info-item">📍 {{ $order->direccion_cliente }}</div>
                    <div class="info-item">📱 {{ $order->telefono_cliente }}</div>
                    <div class="info-item">🆔 {{ $order->cedula_ruc }}</div>
                </div>
            </div>

            <!-- Tickets -->
            @if(count($ticketNumbers) > 0)
            <div class="tickets-section">
                <div class="section-title">Tus números son:</div>
                <div class="tickets-grid">
                    @foreach($ticketNumbers as $number)
                    <div class="ticket">{{ str_pad($number, 5, '0', STR_PAD_LEFT) }}</div>
                    @endforeach
                </div>
            </div>
            @endif

            <!-- Additional Information -->
            <div class="additional-info">
                <div class="section-title">Más información:</div>
                <div class="info-text">
                    <strong>¡Gracias por participar en nuestra actividad #{{ $activity->id }}!</strong>
                </div>

                @if(count($winningNumbers) > 0)
                <div class="info-text">
                    🎁 <strong>¡NÚMEROS CON PREMIOS ESPECIALES!</strong><br>
                    Hay {{ count($winningNumbers) }} números bendecidos con premios en efectivo, revisa si tienes uno de estos números:
                </div>
                @endif
            </div>

            <!-- Winning Numbers -->
            @if(count($winningNumbers) > 0)
            <div class="winning-numbers">
                <div class="winning-list">
                    @foreach($winningNumbers as $number)
                    <div class="winning-number-item">#{{ str_pad($number, 5, '0', STR_PAD_LEFT) }}</div>
                    @endforeach
                </div>
            </div>
            @endif
        </div>

        <!-- Social Section -->
        <div class="social-section">
            <div class="social-text">
                Los artículos se jugarán una vez vendidos todos los números. Anunciaremos
                al ganador del <strong>{{ $activity->premio_principal }}</strong> mediante un live en nuestras cuentas de Instagram oficiales.
                ¡Síguenos para no perdértelo!
            </div>

            <div class="social-accounts">
                <div class="social-account">
                    <div class="social-name">NexoGo EC</div>
                    <div class="social-handle">@nexoGoEc</div>
                </div>
            </div>

            <div class="footer-text">¡Te deseamos mejor de las suertes!</div>

            <a href="https://nexogo.org/terminos" class="terms-link">Términos y Condiciones</a>
        </div>
    </div>
</body>
</html>