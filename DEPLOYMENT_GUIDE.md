# 🚀 Guía Completa de Deployment - NextGo

## 📋 Resumen del Sistema

**Servidor**: `dtiadmin@18.220.56.116`

**Arquitectura de dominios**:
- 🎯 **Frontend**: `https://nexogo.org` → `/var/www/nexogo.org/`
- 🔐 **Admin**: `https://admin.nexogo.org` → `/var/www/admin.nexogo.org/`
- 🔌 **API**: `https://api.nexogo.org` → `/var/www/api.nexogo.org/`

## 🛠️ Preparación Local (YA COMPLETADA)

✅ **Builds compilados con dominios correctos**:
- Admin compilado para `admin.nexogo.org`
- Frontend compilado para `nexogo.org`
- Backend configurado para `api.nexogo.org`

✅ **Archivos listos**:
- `admin/build/` - Panel de administración (63.82 kB)
- `frontend/build/` - Frontend público (103.82 kB)
- `backend/` - API Laravel

## 🔍 Paso 1: Verificar Servidor

```bash
# Verificar el estado del servidor
./check-server.sh
```

Este script verificará:
- Conexión SSH
- Estructura de directorios
- Software instalado (Apache, PHP, Composer)
- Permisos del usuario

## 🚀 Paso 2: Deployment Completo

```bash
# Subir todos los archivos al servidor
./deploy-to-server.sh
```

Este script:
- ✅ Sube frontend a `/var/www/nexogo.org/`
- ✅ Sube admin a `/var/www/admin.nexogo.org/`
- ✅ Sube backend a `/var/www/api.nexogo.org/`
- ✅ Instala dependencias de Composer
- ✅ Configura permisos
- ✅ Optimiza Laravel para producción

## 🌐 Paso 3: Configurar Virtual Hosts

```bash
# Configurar Apache virtual hosts
./configure-vhosts.sh
```

Este script:
- ✅ Sube configuraciones de Apache
- ✅ Habilita módulos necesarios
- ✅ Configura los 3 dominios
- ✅ Reinicia Apache

## 🔒 Paso 4: Configurar SSL

```bash
# Conectar al servidor
ssh dtiadmin@18.220.56.116

# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-apache

# Obtener certificados SSL para los 3 dominios
sudo certbot --apache -d nexogo.org -d admin.nexogo.org -d api.nexogo.org
```

## 🌍 Paso 5: Configurar DNS

Actualizar los registros DNS para apuntar a `18.220.56.116`:

```
nexogo.org        A    18.220.56.116
admin.nexogo.org  A    18.220.56.116
api.nexogo.org    A    18.220.56.116
```

## ⚙️ Paso 6: Configurar Backend

```bash
# Conectar al servidor
ssh dtiadmin@18.220.56.116

# Ir al directorio del backend
cd /var/www/api.nexogo.org

# Editar variables de entorno
nano .env
```

**Configurar en .env**:
```env
APP_NAME=NextGo
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.nexogo.org

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nextgo_prod
DB_USERNAME=tu_usuario_db
DB_PASSWORD=tu_password_db

SANCTUM_STATEFUL_DOMAINS=nexogo.org,admin.nexogo.org
```

**Ejecutar migraciones**:
```bash
php artisan migrate --force
php artisan db:seed
```

## 🧪 Paso 7: Verificar Deployment

### URLs a probar:
- **Frontend**: `https://nexogo.org`
- **Admin Panel**: `https://admin.nexogo.org`
- **API**: `https://api.nexogo.org/api`

### Verificaciones:
1. ✅ Frontend carga correctamente
2. ✅ Admin panel muestra login
3. ✅ API responde con JSON
4. ✅ CORS funciona entre dominios
5. ✅ SSL certificates activos

## 📁 Estructura de Archivos en Servidor

```
/var/www/
├── nexogo.org/          # Frontend React
│   ├── index.html
│   ├── static/
│   └── ...
├── admin.nexogo.org/    # Admin Panel React
│   ├── index.html
│   ├── static/
│   └── ...
└── api.nexogo.org/      # Backend Laravel
    ├── app/
    ├── config/
    ├── public/          # DocumentRoot
    ├── .env
    └── ...
```

## 🔧 Comandos Útiles de Mantenimiento

### En el servidor:

```bash
# Ver logs de Apache
sudo tail -f /var/log/apache2/nexogo.org_error.log
sudo tail -f /var/log/apache2/admin.nexogo.org_error.log
sudo tail -f /var/log/apache2/api.nexogo.org_error.log

# Ver logs de Laravel
tail -f /var/www/api.nexogo.org/storage/logs/laravel.log

# Reiniciar Apache
sudo systemctl restart apache2

# Ver estado de Apache
sudo systemctl status apache2

# Limpiar cache de Laravel
cd /var/www/api.nexogo.org
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Actualizar código:

```bash
# Volver a compilar localmente
cd admin && npm run build
cd ../frontend && npm run build

# Volver a subir
./deploy-to-server.sh
```

## 🆘 Troubleshooting

### Si el frontend no carga:
1. Verificar que `index.html` existe en `/var/www/nexogo.org/`
2. Verificar permisos: `sudo chown -R www-data:www-data /var/www/nexogo.org/`
3. Verificar configuración de Apache

### Si la API no responde:
1. Verificar logs: `tail -f /var/log/apache2/api.nexogo.org_error.log`
2. Verificar que PHP está funcionando: `php -v`
3. Verificar que Laravel está configurado: `cd /var/www/api.nexogo.org && php artisan route:list`

### Si hay errores de CORS:
1. Verificar configuración en `backend/config/cors.php`
2. Verificar que los dominios están correctos
3. Limpiar cache: `php artisan config:clear`

## 📊 Monitoreo

### Verificar que todo funciona:
```bash
# Test Frontend
curl -I https://nexogo.org

# Test Admin
curl -I https://admin.nexogo.org

# Test API
curl https://api.nexogo.org/api
```

## 🎉 ¡Deployment Completado!

Una vez completados todos los pasos, tendrás:

- ✅ Frontend funcionando en `nexogo.org`
- ✅ Admin panel funcionando en `admin.nexogo.org`
- ✅ API funcionando en `api.nexogo.org`
- ✅ SSL habilitado en todos los dominios
- ✅ CORS configurado correctamente
- ✅ Base de datos configurada y migrada

**¡El sistema NextGo estará completamente operativo!** 🚀