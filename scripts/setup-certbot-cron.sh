#!/bin/bash
# Setup certbot auto-renewal cron job
echo '0 3 * * * root certbot renew --quiet --deploy-hook "cp -rL /etc/letsencrypt/* /home/berong-safescape/certbot/conf/ && docker restart bfp-nginx"' | sudo tee /etc/cron.d/certbot-renew
sudo chmod 644 /etc/cron.d/certbot-renew
echo "Certbot auto-renewal configured"
