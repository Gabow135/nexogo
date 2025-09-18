#!/bin/bash

# Script para arreglar permisos del servidor NextGo
echo "🔧 Arreglando permisos del servidor NextGo"
echo "=========================================="

SERVIDOR="dtiadmin@18.220.56.116"
API_PATH="/var/www/api.nexogo.org"

echo "Conectando al servidor para arreglar permisos..."

ssh $SERVIDOR << 'EOF'
echo "📁 Navegando al directorio de la API..."
cd /var/www/api.nexogo.org

echo "🔐 Cambiando propietario de todos los archivos a www-data..."
sudo chown -R www-data:www-data .

echo "📂 Configurando permisos de directorios..."
sudo find . -type d -exec chmod 755 {} \;

echo "📄 Configurando permisos de archivos..."
sudo find . -type f -exec chmod 644 {} \;

echo "🔒 Configurando permisos especiales para storage y bootstrap..."
sudo chmod -R 775 storage
sudo chmod -R 775 bootstrap/cache

echo "💾 Verificando y arreglando permisos de la base de datos..."
if [ -f "database/database.sqlite" ]; then
    sudo chmod 664 database/database.sqlite
    sudo chown www-data:www-data database/database.sqlite
    echo "✅ Base de datos SQLite configurada"
fi

if [ -f "storage/database.sqlite" ]; then
    sudo chmod 664 storage/database.sqlite
    sudo chown www-data:www-data storage/database.sqlite
    echo "✅ Base de datos SQLite en storage configurada"
fi

echo "🗂️ Creando directorios faltantes si no existen..."
sudo mkdir -p storage/logs
sudo mkdir -p storage/framework/cache
sudo mkdir -p storage/framework/sessions
sudo mkdir -p storage/framework/views
sudo mkdir -p bootstrap/cache

echo "📝 Configurando permisos finales..."
sudo chmod -R 775 storage
sudo chmod -R 775 bootstrap/cache
sudo chown -R www-data:www-data storage
sudo chown -R www-data:www-data bootstrap/cache

echo "🧹 Limpiando archivos de cache problemáticos..."
sudo rm -f bootstrap/cache/config.php
sudo rm -f bootstrap/cache/routes-v7.php
sudo rm -f storage/logs/*.log

echo "✅ Permisos configurados correctamente!"

echo "🔍 Verificando estructura de permisos..."
ls -la storage/
ls -la bootstrap/cache/
if [ -f "database/database.sqlite" ]; then
    ls -la database/database.sqlite
fi
if [ -f "storage/database.sqlite" ]; then
    ls -la storage/database.sqlite
fi

EOF

echo ""
echo "🎉 Permisos del servidor arreglados!"
echo ""
echo "Ahora puedes ejecutar nuevamente:"
echo "./deploy-selective.sh (opción 3)"