#!/bin/sh

# Ensure nginx.conf is properly set up
if [ ! -f /etc/nginx/nginx.conf ]; then
  echo "Nginx configuration file not found!"
  exit 1
fi

# Start Nginx in the foreground
nginx -g "daemon off;"
