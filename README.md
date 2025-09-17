# NextGo - Sistema de Rifas

Sistema completo de gestión de rifas con panel de administración, frontend público y API backend.

## 📁 Estructura del Proyecto

```
NextGo/
├── admin/               # Panel de administración (React TypeScript)
│   ├── build/          # Compilado para producción
│   ├── src/            # Código fuente del admin
│   └── package.json    # Dependencias del admin
├── frontend/            # Frontend público (React TypeScript)
│   ├── build/          # Compilado para producción
│   ├── src/            # Código fuente del frontend
│   └── package.json    # Dependencias del frontend
├── backend/             # API Backend (Laravel)
│   ├── app/            # Lógica de la aplicación
│   ├── config/         # Configuraciones
│   ├── database/       # Migraciones y seeders
│   └── routes/         # Rutas API
└── index.html          # Landing page estática
```

## 🚀 Deployment

### 1. Compilación para Producción

#### Admin Panel
```bash
cd admin
npm install
npm run build
```

#### Frontend
```bash
cd frontend
npm install
npm run build
```

### 2. Deployment del Backend (Solo Laravel)

Para subir solo el backend a producción, necesitas:

#### Archivos/Carpetas Necesarios:
```
backend/
├── app/                 # ✅ Lógica de la aplicación
├── bootstrap/           # ✅ Archivos de arranque
├── config/              # ✅ Configuraciones
├── database/            # ✅ Migraciones y seeders
├── public/              # ✅ Punto de entrada público
├── resources/           # ✅ Views y assets
├── routes/              # ✅ Rutas de la aplicación
├── storage/             # ✅ Logs, cache, uploads
├── vendor/              # ❌ Se instala con composer
├── .env.example         # ✅ Template de variables
├── artisan              # ✅ CLI de Laravel
├── composer.json        # ✅ Dependencias PHP
└── composer.lock        # ✅ Versiones exactas
```

#### Pasos para Deployment:

1. **Subir archivos del backend** (excluir vendor/ y .env):
```bash
# Desde la raíz del proyecto
rsync -av --exclude 'vendor/' --exclude '.env' backend/ usuario@servidor:/ruta/del/proyecto/
```

2. **En el servidor, instalar dependencias**:
```bash
cd /ruta/del/proyecto
composer install --optimize-autoloader --no-dev
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
nano .env  # Editar con los datos de producción
```

4. **Generar clave de aplicación**:
```bash
php artisan key:generate
```

5. **Ejecutar migraciones**:
```bash
php artisan migrate --force
```

6. **Optimizar para producción**:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

7. **Configurar permisos**:
```bash
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 3. Configuración del Servidor Web

#### Apache (.htaccess ya incluido)
Apuntar DocumentRoot a `backend/public/`

#### Nginx
```nginx
server {
    listen 80;
    server_name tu-dominio.com;
    root /ruta/del/proyecto/backend/public;
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
}
```

### 4. Variables de Entorno (.env) para Producción

```env
APP_NAME=NextGo
APP_ENV=production
APP_KEY=base64:xxx  # Generado con php artisan key:generate
APP_DEBUG=false
APP_URL=https://tu-dominio.com

LOG_CHANNEL=stack

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nextgo_prod
DB_USERNAME=usuario_db
DB_PASSWORD=password_db

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=nexogo.org,admin.nexogo.org
```

## 📱 URLs de Acceso

- **Frontend Público**: `https://nexogo.org/` (build de frontend)
- **Admin Panel**: `https://admin.nexogo.org/` (build de admin)
- **API Backend**: `https://api.nexogo.org/api/`
- **Landing Page**: `https://nexogo.org/landing.html` (archivo estático)

## 🔧 Comandos Útiles de Laravel

```bash
# Ver rutas
php artisan route:list

# Limpiar caché
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Ver logs
tail -f storage/logs/laravel.log

# Correr seeders
php artisan db:seed

# Rollback migraciones
php artisan migrate:rollback
```

## 🛠️ Desarrollo Local

```bash
# Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Admin (puerto 3001)
cd admin
npm install
PORT=3001 npm start

# Frontend (puerto 3000)
cd frontend
npm install
npm start
```

## 📦 Estructura de Builds

Después de compilar, tendrás:

- `admin/build/` - Panel de administración estático
- `frontend/build/` - Frontend público estático
- `backend/` - API Laravel lista para producción

Los builds estáticos pueden servirse desde cualquier servidor web o CDN.