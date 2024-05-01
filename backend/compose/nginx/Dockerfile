FROM nginx:alpine

# Eğer gerekliyse konfigürasyon dosyalarını kopyalayın
COPY nginx.conf /etc/nginx/nginx.conf

# Nginx portunu açın
EXPOSE 80

# Container ayağa kalktığında nginx servisini başlatın
CMD ["nginx", "-g", "daemon off;"]