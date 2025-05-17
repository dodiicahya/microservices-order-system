#!/bin/sh

HOST="$1"
PORT="$2"

echo "⏳ Waiting for PostgreSQL at $HOST:$PORT..."

until psql -h "$HOST" -p "$PORT" -U "$DB_USERNAME" -c '\q' 2>/dev/null; do
  sleep 1
done

echo "✅ PostgreSQL is ready!"
exec "$@"
