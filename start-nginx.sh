#!/bin/sh

# Ensure the template exists before substituting variables
if [ ! -f /etc/nginx/templates/default.conf.template ]; then
  echo "Nginx configuration template not found!"
  exit 1
fi

# Replace environment variables and move the config to the correct directory
envsubst '$VITE_API_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Start Nginx in the foreground
nginx -g "daemon off;"
