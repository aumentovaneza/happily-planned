# syntax=docker/dockerfile:1

# Single stage: the Vite build invokes the Wayfinder plugin, which shells out to
# `php artisan wayfinder:generate`, so the asset build needs PHP + Node together.
FROM php:8.4-cli-bookworm AS app

# System libraries, PHP extensions, and Node 20.
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip curl ca-certificates gnupg \
        libzip-dev libicu-dev libpng-dev libonig-dev default-mysql-client \
    && docker-php-ext-install pdo_mysql zip intl gd bcmath exif pcntl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer from the official image.
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# A build-time app key so `php artisan` can boot during the asset build.
# At runtime this is overridden by the APP_KEY provided in docker-compose.yml.
ENV APP_KEY="base64:ujnvR08HwMe/mi/6hZwpjGW3shg0cfMNTP/P7XhjxeU="
ENV VITE_APP_NAME="Happily Planned"

WORKDIR /app

# PHP dependencies (laravel/wayfinder is in require, so it survives --no-dev and
# the `php artisan wayfinder:generate` call during the Vite build still works).
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Frontend build (regenerates Wayfinder types via PHP, then bundles assets),
# then drop node_modules to slim the runtime image.
RUN npm ci && npm run build && rm -rf node_modules

RUN chmod +x docker/entrypoint.sh \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8000

ENTRYPOINT ["docker/entrypoint.sh"]
