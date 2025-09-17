#!/bin/bash

# NextGo Complete Deployment Script
# Script para subir todos los archivos al servidor

echo "🚀 NextGo Complete Deployment to 18.220.56.116"
echo "=============================================="

# Variables del servidor
SERVIDOR="dtiadmin@18.220.56.116"
BASE_PATH="/var/www"

# Función para mostrar mensajes
log() {
    echo "✅ $1"
}

error() {
    echo "❌ $1"
    exit 1
}

warning() {
    echo "⚠️ $1"
}

# Verificar que los builds existen
if [ ! -d "admin/build" ]; then
    error "No se encontró admin/build/. Ejecuta 'cd admin && npm run build' primero."
fi

if [ ! -d "frontend/build" ]; then
    error "No se encontró frontend/build/. Ejecuta 'cd frontend && npm run build' primero."
fi

if [ ! -d "backend" ]; then
    error "No se encontró el directorio backend/."
fi

log "Verificando builds locales... ✓"

# Verificar conexión al servidor
echo ""
echo "🔗 Verificando conexión al servidor..."
if ! ssh -o ConnectTimeout=10 $SERVIDOR "echo 'Conexión exitosa'" 2>/dev/null; then
    error "No se puede conectar al servidor $SERVIDOR"
fi

log "Conexión al servidor verificada ✓"

# Verificar estructura en el servidor
echo ""
echo "📁 Verificando estructura de directorios en el servidor..."
ssh $SERVIDOR "
    echo 'Directorio actual:' && pwd
    echo ''
    echo 'Contenido de /var/www:'
    ls -la $BASE_PATH/ 2>/dev/null || echo 'Directorio /var/www no existe'
    echo ''
    echo 'Verificando si existen los directorios de destino:'
    [ -d '$BASE_PATH/nexogo.org' ] && echo '✅ nexogo.org existe' || echo '❌ nexogo.org no existe'
    [ -d '$BASE_PATH/admin.nexogo.org' ] && echo '✅ admin.nexogo.org existe' || echo '❌ admin.nexogo.org no existe'
    [ -d '$BASE_PATH/api.nexogo.org' ] && echo '✅ api.nexogo.org existe' || echo '❌ api.nexogo.org no existe'
"

echo ""
read -p "¿Las rutas del servidor están correctas? ¿Continuar con el deployment? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    error "Deployment cancelado por el usuario"
fi

# Crear directorios si no existen
echo ""
log "Creando directorios en el servidor si no existen..."
ssh $SERVIDOR "
    sudo mkdir -p $BASE_PATH/nexogo.org
    sudo mkdir -p $BASE_PATH/admin.nexogo.org
    sudo mkdir -p $BASE_PATH/api.nexogo.org
    sudo chown -R dtiadmin:dtiadmin $BASE_PATH/nexogo.org
    sudo chown -R dtiadmin:dtiadmin $BASE_PATH/admin.nexogo.org
    sudo chown -R dtiadmin:dtiadmin $BASE_PATH/api.nexogo.org
"

# Deployment del Frontend (nexogo.org)
echo ""
log "📤 Subiendo Frontend a nexogo.org..."
rsync -av --progress --no-times frontend/build/ $SERVIDOR:$BASE_PATH/nexogo.org/
RSYNC_EXIT=$?
if [ $RSYNC_EXIT -eq 0 ] || [ $RSYNC_EXIT -eq 23 ]; then
    log "Frontend subido exitosamente (código: $RSYNC_EXIT)"
    if [ $RSYNC_EXIT -eq 23 ]; then
        warning "Algunos permisos no pudieron ser establecidos (normal en algunos servidores)"
    fi
else
    error "Error al subir el frontend (código: $RSYNC_EXIT)"
fi

# Deployment del Admin (admin.nexogo.org)
echo ""
log "📤 Subiendo Admin Panel a admin.nexogo.org..."
rsync -av --progress --no-times admin/build/ $SERVIDOR:$BASE_PATH/admin.nexogo.org/
RSYNC_EXIT=$?
if [ $RSYNC_EXIT -eq 0 ] || [ $RSYNC_EXIT -eq 23 ]; then
    log "Admin Panel subido exitosamente (código: $RSYNC_EXIT)"
    if [ $RSYNC_EXIT -eq 23 ]; then
        warning "Algunos permisos no pudieron ser establecidos (normal en algunos servidores)"
    fi
else
    error "Error al subir el admin panel (código: $RSYNC_EXIT)"
fi

# Deployment del Backend (api.nexogo.org)
echo ""
log "📤 Subiendo Backend Laravel a api.nexogo.org..."
rsync -av --progress --no-times \
    --exclude='vendor/' \
    --exclude='.env' \
    --exclude='node_modules/' \
    --exclude='storage/logs/*.log' \
    --exclude='.git/' \
    backend/ $SERVIDOR:$BASE_PATH/api.nexogo.org/

RSYNC_EXIT=$?
if [ $RSYNC_EXIT -eq 0 ] || [ $RSYNC_EXIT -eq 23 ]; then
    log "Backend subido exitosamente (código: $RSYNC_EXIT)"
    if [ $RSYNC_EXIT -eq 23 ]; then
        warning "Algunos permisos no pudieron ser establecidos (normal en algunos servidores)"
    fi
else
    error "Error al subir el backend (código: $RSYNC_EXIT)"
fi

# Configurar el backend en el servidor
echo ""
log "🔧 Configurando Backend en el servidor..."
ssh $SERVIDOR "
    cd $BASE_PATH/api.nexogo.org

    # Instalar dependencias de Composer
    echo '📦 Instalando dependencias de Composer...'
    composer install --optimize-autoloader --no-dev

    # Configurar .env si no existe
    if [ ! -f '.env' ]; then
        echo '⚙️ Configurando archivo .env...'
        cp .env.example .env
        php artisan key:generate
        echo '✏️ NECESITAS EDITAR EL ARCHIVO .env CON TUS DATOS DE PRODUCCIÓN'
    fi

    # Configurar permisos
    echo '🔒 Configurando permisos...'
    chmod -R 755 storage bootstrap/cache
    sudo chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || chown -R dtiadmin:dtiadmin storage bootstrap/cache

    # Optimizar para producción
    echo '⚡ Optimizando para producción...'
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache

    echo '✅ Backend configurado'
"

# Verificar deployment
echo ""
log "🔍 Verificando deployment..."
ssh $SERVIDOR "
    echo 'Verificando archivos subidos:'
    echo ''
    echo 'Frontend (nexogo.org):'
    ls -la $BASE_PATH/nexogo.org/ | head -5
    echo ''
    echo 'Admin (admin.nexogo.org):'
    ls -la $BASE_PATH/admin.nexogo.org/ | head -5
    echo ''
    echo 'Backend (api.nexogo.org):'
    ls -la $BASE_PATH/api.nexogo.org/ | head -5
    echo ''
    echo 'Verificando archivo .env del backend:'
    [ -f '$BASE_PATH/api.nexogo.org/.env' ] && echo '✅ .env existe' || echo '❌ .env no existe'
"

# Resumen final
echo ""
echo "🎉 Deployment Completado!"
echo ""
echo "📋 Resumen:"
echo "- ✅ Frontend subido a: $BASE_PATH/nexogo.org/"
echo "- ✅ Admin subido a: $BASE_PATH/admin.nexogo.org/"
echo "- ✅ Backend subido a: $BASE_PATH/api.nexogo.org/"
echo ""
echo "🔧 Próximos pasos:"
echo "1. Editar .env en el backend con datos de producción"
echo "2. Configurar virtual hosts para los dominios"
echo "3. Configurar SSL para nexogo.org, admin.nexogo.org, api.nexogo.org"
echo "4. Ejecutar migraciones: ssh $SERVIDOR 'cd $BASE_PATH/api.nexogo.org && php artisan migrate --force'"
echo ""
echo "📂 Acceso a archivos:"
echo "   ssh $SERVIDOR"
echo "   cd $BASE_PATH/api.nexogo.org"
echo "   nano .env"
echo ""

log "Script de deployment completado!"