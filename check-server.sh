#!/bin/bash

# Script para verificar el servidor antes del deployment
echo "🔍 Verificando Servidor NextGo - 18.220.56.116"
echo "=============================================="

SERVIDOR="dtiadmin@18.220.56.116"

echo "🔗 Conectando al servidor..."

# Verificar conexión y mostrar información del servidor
ssh $SERVIDOR "
    echo '✅ Conexión exitosa al servidor'
    echo ''
    echo '📋 Información del servidor:'
    echo 'Usuario actual:' \$(whoami)
    echo 'Directorio home:' \$(pwd)
    echo 'Sistema operativo:' \$(cat /etc/os-release | grep PRETTY_NAME | cut -d'=' -f2 | tr -d '\"')
    echo ''

    echo '📁 Estructura de directorios web:'
    echo ''

    # Verificar /var/www
    if [ -d '/var/www' ]; then
        echo '✅ /var/www existe'
        echo 'Contenido de /var/www:'
        ls -la /var/www/
        echo ''

        # Verificar directorios específicos para NextGo
        echo '🎯 Verificando directorios para NextGo:'
        [ -d '/var/www/nexogo.org' ] && echo '✅ /var/www/nexogo.org existe' || echo '❌ /var/www/nexogo.org NO existe'
        [ -d '/var/www/admin.nexogo.org' ] && echo '✅ /var/www/admin.nexogo.org existe' || echo '❌ /var/www/admin.nexogo.org NO existe'
        [ -d '/var/www/api.nexogo.org' ] && echo '✅ /var/www/api.nexogo.org existe' || echo '❌ /var/www/api.nexogo.org NO existe'
        echo ''
    else
        echo '❌ /var/www NO existe'
        echo ''
    fi

    # Verificar /var/www/html (ruta alternativa común)
    if [ -d '/var/www/html' ]; then
        echo '📂 /var/www/html existe (ruta alternativa)'
        echo 'Contenido de /var/www/html:'
        ls -la /var/www/html/
        echo ''
    fi

    echo '🔧 Verificando software instalado:'

    # Verificar Apache
    if command -v apache2 &> /dev/null; then
        echo '✅ Apache está instalado'
        apache2 -v | head -1
    elif command -v httpd &> /dev/null; then
        echo '✅ Apache (httpd) está instalado'
        httpd -v | head -1
    else
        echo '❌ Apache no encontrado'
    fi

    # Verificar Nginx
    if command -v nginx &> /dev/null; then
        echo '✅ Nginx está instalado'
        nginx -v 2>&1
    else
        echo '❌ Nginx no encontrado'
    fi

    # Verificar PHP
    if command -v php &> /dev/null; then
        echo '✅ PHP está instalado'
        php -v | head -1
    else
        echo '❌ PHP no encontrado'
    fi

    # Verificar Composer
    if command -v composer &> /dev/null; then
        echo '✅ Composer está instalado'
        composer --version | head -1
    else
        echo '❌ Composer no encontrado'
    fi

    echo ''
    echo '👤 Permisos del usuario:'
    echo 'Grupos del usuario:' \$(groups)
    echo ''

    # Verificar permisos de escritura en /var/www
    if [ -w '/var/www' ]; then
        echo '✅ El usuario tiene permisos de escritura en /var/www'
    else
        echo '❌ El usuario NO tiene permisos de escritura en /var/www'
        echo '   Será necesario usar sudo para crear directorios'
    fi

    echo ''
    echo '🌐 Verificando configuración de virtual hosts:'

    # Verificar configuración de Apache
    if [ -d '/etc/apache2/sites-available' ]; then
        echo 'Sites disponibles en Apache:'
        ls -la /etc/apache2/sites-available/ | grep nexogo || echo 'No hay configuraciones de nexogo'
        echo ''
        echo 'Sites habilitados en Apache:'
        ls -la /etc/apache2/sites-enabled/ | grep nexogo || echo 'No hay configuraciones de nexogo habilitadas'
    fi

    # Verificar configuración de Nginx
    if [ -d '/etc/nginx/sites-available' ]; then
        echo 'Sites disponibles en Nginx:'
        ls -la /etc/nginx/sites-available/ | grep nexogo || echo 'No hay configuraciones de nexogo'
        echo ''
        echo 'Sites habilitados en Nginx:'
        ls -la /etc/nginx/sites-enabled/ | grep nexogo || echo 'No hay configuraciones de nexogo habilitadas'
    fi
"

echo ""
echo "📋 Recomendaciones basadas en la verificación:"
echo ""
echo "1. Si los directorios nexogo.org no existen, el script deploy-to-server.sh los creará"
echo "2. Si no tienes permisos de escritura, necesitarás sudo en algunos comandos"
echo "3. Asegúrate de que PHP y Composer estén instalados para el backend Laravel"
echo "4. Configura los virtual hosts después del deployment"
echo ""
echo "Para proceder con el deployment, ejecuta:"
echo "   ./deploy-to-server.sh"
echo ""