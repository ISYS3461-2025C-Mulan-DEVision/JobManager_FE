#!/bin/sh
# ========================================
# Docker Entrypoint Script
# Performs any runtime configuration before starting Nginx
# ========================================

set -e

echo "🚀 Starting JobManager Frontend..."
echo "📋 Environment: ${VITE_ENV:-production}"

# Optional: Runtime environment variable substitution
# This allows overriding API URLs at container runtime
# Uncomment if you need runtime config instead of build-time

# if [ -n "$RUNTIME_API_URL" ]; then
#     echo "🔧 Configuring runtime API URL: $RUNTIME_API_URL"
#     find /usr/share/nginx/html -name '*.js' -exec \
#         sed -i "s|RUNTIME_API_PLACEHOLDER|$RUNTIME_API_URL|g" {} \;
# fi

# Execute the main command (nginx)
exec "$@"
