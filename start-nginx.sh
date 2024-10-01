#!/bin/sh

# Replace placeholders with actual values
envsubst '$VITE_API_URL' < /etc/nginx/nginx-template.conf > /etc/nginx/conf.d/default.conf

# Start Nginx
nginx -g 'daemon off;'
