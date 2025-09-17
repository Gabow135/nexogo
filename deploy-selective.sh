#!/bin/bash

# NextGo Selective Deployment Script
# Script para actualizar selectivamente los componentes del proyecto

echo "🚀 NextGo Selective Deployment"
echo "=============================="
echo ""

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

# Menú de selección
echo "¿Qué deseas actualizar?"
echo "1) Admin Panel (admin.nexogo.org)"
echo "2) Frontend (nexogo.org)"
echo "3) Backend API (api.nexogo.org)"
echo "4) Admin + Backend (más común)"
echo "5) Todo (Admin + Frontend + Backend)"
echo "0) Salir"
echo ""
read -p "Selecciona una opción (0-5): " opcion

case $opcion in
    1)
        # Solo Admin
        echo ""
        log "📤 Actualizando Admin Panel..."

        # Verificar que existe el build
        if [ ! -d "admin/build" ]; then
            warning "No se encontró admin/build. Compilando..."
            cd admin && npm run build && cd ..
        fi

        # Subir Admin
        rsync -av --progress --no-times admin/build/ $SERVIDOR:$BASE_PATH/admin.nexogo.org/

        log "Admin Panel actualizado!"
        ;;

    2)
        # Solo Frontend
        echo ""
        log "📤 Actualizando Frontend..."

        # Verificar que existe el build
        if [ ! -d "frontend/build" ]; then
            warning "No se encontró frontend/build. Compilando..."
            cd frontend && npm run build && cd ..
        fi

        # Subir Frontend
        rsync -av --progress --no-times frontend/build/ $SERVIDOR:$BASE_PATH/nexogo.org/

        log "Frontend actualizado!"
        ;;

    3)
        # Solo Backend
        echo ""
        log "📤 Actualizando Backend API..."

        # Subir Backend
        rsync -av --progress --no-times \
            --exclude='vendor/' \
            --exclude='.env' \
            --exclude='node_modules/' \
            --exclude='storage/logs/*.log' \
            --exclude='.git/' \
            backend/ $SERVIDOR:$BASE_PATH/api.nexogo.org/

        # Configurar en el servidor
        echo ""
        log "🔧 Configurando Backend en el servidor..."
        ssh $SERVIDOR "
            cd $BASE_PATH/api.nexogo.org

            # Limpiar cache
            php artisan config:clear
            php artisan cache:clear
            php artisan route:clear

            # Recrear cache
            php artisan config:cache
            php artisan route:cache

            # Verificar permisos
            sudo chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || echo 'Permisos ya configurados'
        "

        log "Backend API actualizado!"
        ;;

    4)
        # Admin + Backend
        echo ""
        log "📤 Actualizando Admin Panel y Backend API..."

        # Compilar Admin si es necesario
        if [ ! -d "admin/build" ]; then
            warning "No se encontró admin/build. Compilando..."
            cd admin && npm run build && cd ..
        fi

        # Subir Admin
        echo ""
        log "Subiendo Admin Panel..."
        rsync -av --progress --no-times admin/build/ $SERVIDOR:$BASE_PATH/admin.nexogo.org/

        # Subir Backend
        echo ""
        log "Subiendo Backend API..."
        rsync -av --progress --no-times \
            --exclude='vendor/' \
            --exclude='.env' \
            --exclude='node_modules/' \
            --exclude='storage/logs/*.log' \
            --exclude='.git/' \
            backend/ $SERVIDOR:$BASE_PATH/api.nexogo.org/

        # Configurar Backend
        echo ""
        log "Configurando Backend..."
        ssh $SERVIDOR "
            cd $BASE_PATH/api.nexogo.org

            # Limpiar cache
            php artisan config:clear
            php artisan cache:clear
            php artisan route:clear

            # Recrear cache
            php artisan config:cache
            php artisan route:cache

            # Verificar permisos
            sudo chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || echo 'Permisos ya configurados'
        "

        log "Admin Panel y Backend API actualizados!"
        ;;

    5)
        # Todo
        echo ""
        log "📤 Actualizando todos los componentes..."

        # Compilar si es necesario
        if [ ! -d "admin/build" ]; then
            warning "Compilando Admin..."
            cd admin && npm run build && cd ..
        fi

        if [ ! -d "frontend/build" ]; then
            warning "Compilando Frontend..."
            cd frontend && npm run build && cd ..
        fi

        # Subir todo
        echo ""
        log "Subiendo Frontend..."
        rsync -av --progress --no-times frontend/build/ $SERVIDOR:$BASE_PATH/nexogo.org/

        echo ""
        log "Subiendo Admin Panel..."
        rsync -av --progress --no-times admin/build/ $SERVIDOR:$BASE_PATH/admin.nexogo.org/

        echo ""
        log "Subiendo Backend API..."
        rsync -av --progress --no-times \
            --exclude='vendor/' \
            --exclude='.env' \
            --exclude='node_modules/' \
            --exclude='storage/logs/*.log' \
            --exclude='.git/' \
            backend/ $SERVIDOR:$BASE_PATH/api.nexogo.org/

        # Configurar Backend
        echo ""
        log "Configurando Backend..."
        ssh $SERVIDOR "
            cd $BASE_PATH/api.nexogo.org

            # Limpiar cache
            php artisan config:clear
            php artisan cache:clear
            php artisan route:clear

            # Recrear cache
            php artisan config:cache
            php artisan route:cache

            # Verificar permisos
            sudo chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || echo 'Permisos ya configurados'
        "

        log "Todos los componentes actualizados!"
        ;;

    0)
        echo "Saliendo..."
        exit 0
        ;;

    *)
        error "Opción no válida"
        ;;
esac

echo ""
echo "🎉 Deployment completado!"
echo ""

# Opción para ver logs
read -p "¿Deseas ver los logs del servidor? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📋 Logs del servidor:"
    echo "====================="
    ssh $SERVIDOR "
        echo 'Últimas líneas del log de Laravel:'
        tail -10 $BASE_PATH/api.nexogo.org/storage/logs/laravel.log 2>/dev/null || echo 'No hay logs de Laravel'

        echo ''
        echo 'Últimas líneas del log de Apache para API:'
        sudo tail -5 /var/log/apache2/api.nexogo.org_error.log 2>/dev/null || echo 'No hay logs de Apache'
    "
fi

echo ""
log "Script completado!"