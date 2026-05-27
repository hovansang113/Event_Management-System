#!/bin/sh
php artisan config:clear
php artisan config:cache
php artisan route:cache
/usr/bin/supervisord -c /etc/supervisord.conf