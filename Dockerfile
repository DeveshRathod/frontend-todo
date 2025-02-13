# ---- Frontend Build Stage ----
    FROM node:18-alpine as build

    WORKDIR /app
    
    # Copy dependencies
    COPY package*.json ./
    RUN npm install
    
    # Copy source files
    COPY . .
    
    # Build with VITE_API_URL
    ARG VITE_API_URL
    ENV VITE_API_URL=${VITE_API_URL}
    RUN npm run build
    
    # ---- Nginx Serving Stage ----
    FROM nginx:alpine
    
    # Copy built frontend files
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Copy Nginx configuration
    COPY nginx-template.conf /etc/nginx/nginx.conf
    
    # Copy and prepare startup script
    COPY start-nginx.sh /start-nginx.sh
    RUN chmod +x /start-nginx.sh
    
    # Expose port 80 for the frontend
    EXPOSE 80
    
    # Start Nginx using the script
    CMD ["/start-nginx.sh"]
    