#!/bin/sh

echo "Aplicando migrations..."
python manage.py migrate --noinput

python manage.py collectstatic --noinput

echo "Executando seed..."
python manage.py seed || true

echo "Iniciando servidor..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000