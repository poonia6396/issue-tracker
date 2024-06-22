#!/bin/sh

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate

# Start Gunicorn server
echo "Starting server..."
exec gunicorn --bind 0.0.0.0:$PORT issue_tracker.wsgi:application
