#!/bin/bash

# Script para configurar Virtual Hosts en el servidor
echo "🔧 Configurando Virtual Hosts para NextGo"
echo "========================================"

SERVIDOR="dtiadmin@18.220.56.116"

echo "📤 Subiendo configuraciones de virtual hosts al servidor..."

# Subir archivos de configuración
scp server-configs/apache-*.conf $SERVIDOR:~/

echo "🔧 Configurando virtual hosts en el servidor..."

ssh $SERVIDOR "
    echo '📁 Copiando configuraciones a Apache...'

    # Copiar configuraciones a sites-available
    sudo cp ~/apache-nexogo.org.conf /etc/apache2/sites-available/
    sudo cp ~/apache-admin.nexogo.org.conf /etc/apache2/sites-available/
    sudo cp ~/apache-api.nexogo.org.conf /etc/apache2/sites-available/

    echo '✅ Configuraciones copiadas'

    echo '🔌 Habilitando módulos necesarios de Apache...'
    sudo a2enmod rewrite
    sudo a2enmod ssl
    sudo a2enmod headers
    sudo a2enmod deflate
    sudo a2enmod expires

    echo '🌐 Habilitando sites...'
    sudo a2ensite apache-nexogo.org.conf
    sudo a2ensite apache-admin.nexogo.org.conf
    sudo a2ensite apache-api.nexogo.org.conf

    echo '🔄 Verificando configuración de Apache...'
    sudo apache2ctl configtest

    if [ \$? -eq 0 ]; then
        echo '✅ Configuración de Apache válida'
        echo '♻️ Reiniciando Apache...'
        sudo systemctl restart apache2

        if [ \$? -eq 0 ]; then
            echo '✅ Apache reiniciado exitosamente'
        else
            echo '❌ Error al reiniciar Apache'
        fi
    else
        echo '❌ Error en la configuración de Apache'
        echo 'Revisa los archivos de configuración'
    fi

    echo ''
    echo '📋 Estado de los sites:'
    sudo a2ensite 2>/dev/null | grep nexogo || echo 'Ejecuta: sudo a2ensite apache-nexogo.org apache-admin.nexogo.org apache-api.nexogo.org'

    echo ''
    echo '📊 Verificando que Apache esté corriendo:'
    sudo systemctl status apache2 --no-pager -l

    echo ''
    echo '🔍 Verificando puertos en uso:'
    sudo netstat -tlnp | grep :80
    sudo netstat -tlnp | grep :443

    # Limpiar archivos temporales
    rm -f ~/apache-*.conf
"

echo ""
echo "🎉 Configuración de Virtual Hosts completada!"
echo ""
echo "📋 Próximos pasos:"
echo ""
echo "1. ✅ Virtual hosts configurados"
echo "2. 🔒 Configurar SSL certificates:"
echo "   ssh $SERVIDOR"
echo "   sudo apt update && sudo apt install certbot python3-certbot-apache"
echo "   sudo certbot --apache -d nexogo.org -d admin.nexogo.org -d api.nexogo.org"
echo ""
echo "3. 🌐 Actualizar DNS para apuntar a 18.220.56.116:"
echo "   nexogo.org        A    18.220.56.116"
echo "   admin.nexogo.org  A    18.220.56.116"
echo "   api.nexogo.org    A    18.220.56.116"
echo ""
echo "4. 🧪 Probar las URLs:"
echo "   http://nexogo.org        (Frontend)"
echo "   http://admin.nexogo.org  (Admin Panel)"
echo "   http://api.nexogo.org/api (API)"
echo ""
echo "¡Virtual hosts configurados exitosamente!"