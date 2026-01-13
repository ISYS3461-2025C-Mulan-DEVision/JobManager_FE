#!/bin/sh
# ========================================
# Docker Entrypoint Script
# Performs any runtime configuration before starting Nginx
# ========================================

set -e

echo "🚀 Starting JobManager Frontend..."
echo "📋 Environment: ${VITE_ENV:-production}"

# Configure backend URL for nginx proxy
# Default to local Docker host if not specified
BACKEND_URL="${BACKEND_URL:-http://172.17.0.1:8080/api/}"
echo "🔧 Backend URL: $BACKEND_URL"

# Process nginx config template if it exists
if [ -f /etc/nginx/conf.d/default.conf.template ]; then
    echo "📝 Processing nginx configuration template..."
    envsubst '${BACKEND_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
fi

# Execute the main command (nginx)
exec "$@"
