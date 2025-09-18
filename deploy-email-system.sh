#!/bin/bash

echo "Deploying complete email system to production..."

# Deploy backend changes
echo "Uploading backend files..."
rsync -avz --no-times --exclude='.env' --exclude='storage/logs/*' --exclude='bootstrap/cache/*' --exclude='vendor/' backend/ dtiadmin@18.220.56.116:/var/www/api.nexogo.org/

# Install/update dependencies
echo "Installing dependencies on server..."
ssh dtiadmin@18.220.56.116 "cd /var/www/api.nexogo.org && composer install --no-dev --optimize-autoloader"

# Clear caches
echo "Clearing caches..."
ssh dtiadmin@18.220.56.116 "cd /var/www/api.nexogo.org && php artisan cache:clear && php artisan config:clear && php artisan view:clear"

# Set proper permissions
echo "Setting permissions..."
ssh dtiadmin@18.220.56.116 "sudo chown -R www-data:www-data /var/www/api.nexogo.org && sudo chmod -R 755 /var/www/api.nexogo.org && sudo chmod -R 775 /var/www/api.nexogo.org/storage /var/www/api.nexogo.org/bootstrap/cache"

echo "Email system deployment complete!"
echo ""
echo "📧 DEPLOYED EMAIL FEATURES:"
echo "1. Payment Instructions Email - Sent when order is created"
echo "2. Payment Confirmation Email - Sent when payment is approved from admin"
echo ""
echo "Next steps:"
echo "1. Configure SMTP settings in /var/www/api.nexogo.org/.env"
echo "2. Update MAIL_USERNAME and MAIL_PASSWORD with actual Gmail credentials"
echo "3. Test email functionality:"
echo "   - Create new order → Payment instructions email sent"
echo "   - Approve payment from admin → Confirmation email sent"