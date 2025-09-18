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

        # Configurar permisos ANTES del rsync
        echo ""
        log "🔧 Configurando permisos previos..."
        ssh $SERVIDOR "
            cd $BASE_PATH/api.nexogo.org
            sudo chown -R dtiadmin:dtiadmin .
            sudo chmod -R 755 .
        "

        # Subir Backend con forzado de actualización
        rsync -av --progress --no-times --delete-after \
            --exclude='vendor/' \
            --exclude='.env' \
            --exclude='node_modules/' \
            --exclude='storage/logs/*.log' \
            --exclude='storage/app/' \
            --exclude='storage/framework/cache/' \
            --exclude='storage/framework/sessions/' \
            --exclude='storage/framework/views/' \
            --exclude='.git/' \
            backend/ $SERVIDOR:$BASE_PATH/api.nexogo.org/

        # Configurar en el servidor
        echo ""
        log "🔧 Configurando Backend en el servidor..."
        ssh $SERVIDOR "
            cd $BASE_PATH/api.nexogo.org

            # Instalar dependencias
            echo 'Instalando dependencias...'
            composer install --no-dev --optimize-autoloader

            # Limpiar todos los caches
            php artisan config:clear
            php artisan cache:clear
            php artisan route:clear
            php artisan view:clear
            php artisan optimize:clear

            # Verificar que el archivo fue actualizado
            echo 'Verificando PaymentConfirmationMail.php...'
            if grep -q 'is_array' app/Mail/PaymentConfirmationMail.php; then
                echo '✅ PaymentConfirmationMail.php actualizado correctamente'
            else
                echo '❌ PaymentConfirmationMail.php NO fue actualizado'
            fi

            # Recrear cache
            php artisan config:cache
            php artisan route:cache

            # Arreglar permisos completos
            echo 'Configurando permisos del servidor...'
            sudo chown -R www-data:www-data .
            sudo find . -type d -exec chmod 755 {} \;
            sudo find . -type f -exec chmod 644 {} \;
            sudo chmod -R 775 storage
            sudo chmod -R 775 bootstrap/cache

            # Arreglar base de datos si existe
            if [ -f 'database/database.sqlite' ]; then
                sudo chmod 664 database/database.sqlite
                sudo chown www-data:www-data database/database.sqlite
            fi
            if [ -f 'storage/database.sqlite' ]; then
                sudo chmod 664 storage/database.sqlite
                sudo chown www-data:www-data storage/database.sqlite
            fi

            # Limpiar archivos de cache problemáticos
            sudo rm -f bootstrap/cache/config.php bootstrap/cache/routes-v7.php

            # Reiniciar Apache
            echo 'Reiniciando Apache...'
            sudo systemctl restart apache2
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

        # Configurar permisos ANTES del rsync
        echo ""
        log "🔧 Configurando permisos previos..."
        ssh $SERVIDOR "
            cd $BASE_PATH/api.nexogo.org
            sudo chown -R dtiadmin:dtiadmin .
            sudo chmod -R 755 .
        "

        # Subir Backend
        echo ""
        log "Subiendo Backend API..."
        rsync -av --progress --no-times --delete-after \
            --exclude='vendor/' \
            --exclude='.env' \
            --exclude='node_modules/' \
            --exclude='storage/logs/*.log' \
            --exclude='storage/app/' \
            --exclude='storage/framework/cache/' \
            --exclude='storage/framework/sessions/' \
            --exclude='storage/framework/views/' \
            --exclude='.git/' \
            backend/ $SERVIDOR:$BASE_PATH/api.nexogo.org/

        # Configurar Backend
        echo ""
        log "Configurando Backend..."
        ssh $SERVIDOR "
            cd $BASE_PATH/api.nexogo.org

            # Instalar dependencias
            echo 'Instalando dependencias...'
            composer install --no-dev --optimize-autoloader

            # Limpiar todos los caches
            php artisan config:clear
            php artisan cache:clear
            php artisan route:clear
            php artisan view:clear
            php artisan optimize:clear

            # Verificar que el archivo fue actualizado
            echo 'Verificando PaymentConfirmationMail.php...'
            if grep -q 'is_array' app/Mail/PaymentConfirmationMail.php; then
                echo '✅ PaymentConfirmationMail.php actualizado correctamente'
            else
                echo '❌ PaymentConfirmationMail.php NO fue actualizado'
            fi

            # Recrear cache
            php artisan config:cache
            php artisan route:cache

            # Arreglar permisos completos
            echo 'Configurando permisos del servidor...'
            sudo chown -R www-data:www-data .
            sudo find . -type d -exec chmod 755 {} \;
            sudo find . -type f -exec chmod 644 {} \;
            sudo chmod -R 775 storage
            sudo chmod -R 775 bootstrap/cache

            # Arreglar base de datos si existe
            if [ -f 'database/database.sqlite' ]; then
                sudo chmod 664 database/database.sqlite
                sudo chown www-data:www-data database/database.sqlite
            fi
            if [ -f 'storage/database.sqlite' ]; then
                sudo chmod 664 storage/database.sqlite
                sudo chown www-data:www-data storage/database.sqlite
            fi

            # Limpiar archivos de cache problemáticos
            sudo rm -f bootstrap/cache/config.php bootstrap/cache/routes-v7.php

            # Reiniciar Apache
            echo 'Reiniciando Apache...'
            sudo systemctl restart apache2
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

        # Configurar permisos ANTES del rsync
        echo ""
        log "🔧 Configurando permisos previos..."
        ssh $SERVIDOR "
            cd $BASE_PATH/api.nexogo.org
            sudo chown -R dtiadmin:dtiadmin .
            sudo chmod -R 755 .
        "

        echo ""
        log "Subiendo Backend API..."
        rsync -av --progress --no-times --delete-after \
            --exclude='vendor/' \
            --exclude='.env' \
            --exclude='node_modules/' \
            --exclude='storage/logs/*.log' \
            --exclude='storage/app/' \
            --exclude='storage/framework/cache/' \
            --exclude='storage/framework/sessions/' \
            --exclude='storage/framework/views/' \
            --exclude='.git/' \
            backend/ $SERVIDOR:$BASE_PATH/api.nexogo.org/

        # Configurar Backend
        echo ""
        log "Configurando Backend..."
        ssh $SERVIDOR "
            cd $BASE_PATH/api.nexogo.org

            # Instalar dependencias
            echo 'Instalando dependencias...'
            composer install --no-dev --optimize-autoloader

            # Limpiar todos los caches
            php artisan config:clear
            php artisan cache:clear
            php artisan route:clear
            php artisan view:clear
            php artisan optimize:clear

            # Verificar que el archivo fue actualizado
            echo 'Verificando PaymentConfirmationMail.php...'
            if grep -q 'is_array' app/Mail/PaymentConfirmationMail.php; then
                echo '✅ PaymentConfirmationMail.php actualizado correctamente'
            else
                echo '❌ PaymentConfirmationMail.php NO fue actualizado'
            fi

            # Recrear cache
            php artisan config:cache
            php artisan route:cache

            # Arreglar permisos completos
            echo 'Configurando permisos del servidor...'
            sudo chown -R www-data:www-data .
            sudo find . -type d -exec chmod 755 {} \;
            sudo find . -type f -exec chmod 644 {} \;
            sudo chmod -R 775 storage
            sudo chmod -R 775 bootstrap/cache

            # Arreglar base de datos si existe
            if [ -f 'database/database.sqlite' ]; then
                sudo chmod 664 database/database.sqlite
                sudo chown www-data:www-data database/database.sqlite
            fi
            if [ -f 'storage/database.sqlite' ]; then
                sudo chmod 664 storage/database.sqlite
                sudo chown www-data:www-data storage/database.sqlite
            fi

            # Limpiar archivos de cache problemáticos
            sudo rm -f bootstrap/cache/config.php bootstrap/cache/routes-v7.php

            # Reiniciar Apache
            echo 'Reiniciando Apache...'
            sudo systemctl restart apache2
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