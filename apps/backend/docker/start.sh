#!/bin/sh

# Clear và cache lại config từ env của Render
php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Chạy supervisor
/usr/bin/supervisord -c /etc/supervisord.conf