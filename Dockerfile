FROM nginx:1.14.1-alpine
COPY . /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf