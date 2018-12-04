#!/bin/sh

YOUR_DOMAIN="$1"
YOUR_EMAIL="$2"
docker run -it --entrypoint '/bin/sh' certbot/certbot:latest -c "certbot certonly --manual --preferred-challenges=dns --email $YOUR_EMAIL --server https://acme-v02.api.letsencrypt.org/directory --agree-tos -d *.$YOUR_DOMAIN  -d $YOUR_DOMAIN; cat /etc/letsencrypt/live/$YOUR_DOMAIN/fullchain.pem; cat /etc/letsencrypt/live/$YOUR_DOMAIN/privkey.pem"
