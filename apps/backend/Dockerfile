FROM php:8.4-fpm-alpine AS backend

# 1. Cài đặt các gói hệ thống và công cụ build cần thiết cho Alpine
RUN apk update && apk add --no-cache \
    nginx \
    supervisor \
    curl \
    git \
    unzip \
    libzip-dev \
    oniguruma-dev \
    # Thêm các công cụ hỗ trợ build extension PHP
    $PHPIZE_DEPS \
    # Cài đặt Node.js và npm chính thức từ kho ứng dụng của Alpine
    nodejs \
    npm \
    && docker-php-ext-install pdo_mysql mbstring zip bcmath \
    # Xóa bớt các công cụ build sau khi xong để giảm dung lượng image
    && apk del $PHPIZE_DEPS

# 2. Đóng gói Composer
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 3. Copy các file cấu hình dependency trước để tận dụng Docker Cache
COPY composer.json composer.lock package.json vite.config.js ./

# Cài đặt PHP dependencies (Đã thêm --no-scripts để không bị lỗi thiếu file artisan)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-progress --no-scripts

# 4. Copy toàn bộ mã nguồn vào container
COPY . .

# 5. Cài đặt Node dependencies, build assets bằng Vite và dọn dẹp ngay để giảm dung lượng
RUN npm install && npm run build && rm -rf node_modules

# 6. Cấu hình phân quyền cho Laravel / PHP project
# Tạo sẵn thư mục phòng trường hợp dự án mới chưa tạo
RUN mkdir -p storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

RUN chown -R www-data:www-data storage bootstrap/cache && \
    chmod -R 775 storage bootstrap/cache

# Chạy bù các lệnh tối ưu hóa của Laravel sau khi đã có đầy đủ source code và phân quyền
RUN php artisan package:discover --ansi && \
    php artisan config:cache && \
    php artisan route:cache

# 7. Cấu hình Nginx & Supervisor
RUN rm -f /etc/nginx/http.d/default.conf && \
    mkdir -p /var/log/supervisor

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]