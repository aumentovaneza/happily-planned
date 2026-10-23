#!/usr/bin/env bash
set -e

echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT}..."
until php -r "exit(@fsockopen(getenv('DB_HOST'), (int) getenv('DB_PORT')) ? 0 : 1);"; do
    sleep 2
done
echo "MySQL is up."

# Generate an app key if one wasn't supplied via the environment / .env.
if [ -z "${APP_KEY}" ] && ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
    php artisan key:generate --force
fi

# Run migrations and (idempotent) seeders on every boot.
php artisan migrate --force --seed

# Cache framework config for a snappier start. (Routes are intentionally not
# cached — the passkey endpoint uses a closure, which isn't serializable.)
php artisan config:cache

exec php artisan serve --host=0.0.0.0 --port=8000
