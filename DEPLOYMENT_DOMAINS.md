# 🌐 Configuración de Dominios NextGo

## Arquitectura de Dominios

El sistema NextGo está configurado para usar subdominios específicos:

### 🎯 **Frontend Público**
- **Dominio**: `https://nexogo.org`
- **Archivos**: `frontend/build/`
- **Propósito**: Sitio público para participar en rifas

### 🔐 **Panel de Administración**
- **Dominio**: `https://admin.nexogo.org`
- **Archivos**: `admin/build/`
- **Propósito**: Gestión de actividades, órdenes, ganadores

### 🔌 **API Backend**
- **Dominio**: `https://api.nexogo.org`
- **Archivos**: `backend/` (Laravel)
- **Propósito**: API REST para ambos frontends

## 📂 Configuración por Proyecto

### Admin Panel (`admin/`)
```json
// package.json
{
  "homepage": "https://admin.nexogo.org"
}
```

```typescript
// src/services/api.ts
const API_BASE_URL = 'https://api.nexogo.org/api';
```

### Frontend (`frontend/`)
```json
// package.json
{
  "homepage": "https://nexogo.org"
}
```

```typescript
// src/services/api.ts
const API_BASE_URL = 'https://api.nexogo.org/api';
```

### Backend (`backend/`)
```env
# .env
APP_NAME=NextGo
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.nexogo.org

SANCTUM_STATEFUL_DOMAINS=nexogo.org,admin.nexogo.org
```

```php
// config/cors.php
'allowed_origins' => [
    'https://nexogo.org',
    'https://admin.nexogo.org',
    'http://localhost:3000',  // desarrollo
    'http://localhost:3001',  // desarrollo
],
```

## 🚀 Deployment

### 1. **Subir Builds Estáticos**

#### Frontend (nexogo.org)
```bash
# Subir contenido de frontend/build/ a nexogo.org
rsync -av frontend/build/ usuario@servidor:/var/www/nexogo.org/
```

#### Admin (admin.nexogo.org)
```bash
# Subir contenido de admin/build/ a admin.nexogo.org
rsync -av admin/build/ usuario@servidor:/var/www/admin.nexogo.org/
```

### 2. **Subir Backend Laravel**
```bash
# Usar el script automático
./deploy-backend.sh

# O manual
rsync -av --exclude 'vendor/' --exclude '.env' backend/ usuario@servidor:/var/www/api.nexogo.org/
```

## 🔧 Configuración del Servidor

### Apache Virtual Hosts

#### nexogo.org (Frontend)
```apache
<VirtualHost *:443>
    ServerName nexogo.org
    DocumentRoot /var/www/nexogo.org

    <Directory /var/www/nexogo.org>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted

        # React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    SSLEngine on
    SSLCertificateFile /path/to/ssl/cert
    SSLCertificateKeyFile /path/to/ssl/key
</VirtualHost>
```

#### admin.nexogo.org (Admin Panel)
```apache
<VirtualHost *:443>
    ServerName admin.nexogo.org
    DocumentRoot /var/www/admin.nexogo.org

    <Directory /var/www/admin.nexogo.org>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted

        # React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    SSLEngine on
    SSLCertificateFile /path/to/ssl/cert
    SSLCertificateKeyFile /path/to/ssl/key
</VirtualHost>
```

#### api.nexogo.org (Laravel Backend)
```apache
<VirtualHost *:443>
    ServerName api.nexogo.org
    DocumentRoot /var/www/api.nexogo.org/public

    <Directory /var/www/api.nexogo.org/public>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    SSLEngine on
    SSLCertificateFile /path/to/ssl/cert
    SSLCertificateKeyFile /path/to/ssl/key
</VirtualHost>
```

### Nginx (Alternativo)

#### nexogo.org
```nginx
server {
    listen 443 ssl;
    server_name nexogo.org;
    root /var/www/nexogo.org;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    ssl_certificate /path/to/ssl/cert;
    ssl_certificate_key /path/to/ssl/key;
}
```

#### admin.nexogo.org
```nginx
server {
    listen 443 ssl;
    server_name admin.nexogo.org;
    root /var/www/admin.nexogo.org;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    ssl_certificate /path/to/ssl/cert;
    ssl_certificate_key /path/to/ssl/key;
}
```

#### api.nexogo.org
```nginx
server {
    listen 443 ssl;
    server_name api.nexogo.org;
    root /var/www/api.nexogo.org/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    ssl_certificate /path/to/ssl/cert;
    ssl_certificate_key /path/to/ssl/key;
}
```

## 🔒 SSL/HTTPS

Asegúrate de tener certificados SSL para todos los dominios:
- `nexogo.org`
- `admin.nexogo.org`
- `api.nexogo.org`

Puedes usar Let's Encrypt:
```bash
certbot --apache -d nexogo.org -d admin.nexogo.org -d api.nexogo.org
```

## ✅ Verificación

Después del deployment, verifica que todo funcione:

1. **Frontend**: `https://nexogo.org` - Debe cargar la página de rifas
2. **Admin**: `https://admin.nexogo.org` - Debe cargar el login del admin
3. **API**: `https://api.nexogo.org/api/` - Debe responder JSON
4. **CORS**: Las peticiones entre dominios deben funcionar correctamente

## 📊 Tamaños de Build

- **Admin**: 63.82 kB (JS) + 6.51 kB (CSS)
- **Frontend**: 103.82 kB (JS) + 14.55 kB (CSS)
- **Backend**: Laravel completo (sin vendor/)

Los builds están optimizados y listos para producción.