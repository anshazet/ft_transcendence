#!/bin/bash

# Collect static files
# echo "Collect static files"
# python manage.py collectstatic --noinput

sed -i -e 's/POSTGRES_DB/'${POSTGRES_DB}'/g' pong/settings.py
sed -i -e 's/POSTGRES_USER/'${POSTGRES_USER}'/g' pong/settings.py
sed -i -e 's/POSTGRES_PASSWORD/'${POSTGRES_PASSWORD}'/g' pong/settings.py

# Make database migrations
echo "Making database migrations"
python3 manage.py makemigrations

# Apply database migrations
echo "Applying database migrations"
python3 manage.py migrate

# Start server
echo "Starting server"
python manage.py runserver 0.0.0.0:8000
