#!/bin/bash

# FARIIMA Deployment Script
# برای دیپلوی خودکار پروژه روی سرور

set -e

echo "🚀 FARIIMA Deployment Script"
echo "=============================="
echo ""

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

error() {
    echo -e "${RED}✗ $1${NC}"
}

info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# چک کردن سرور
SERVER_IP="82.115.13.174"
info "Target server: $SERVER_IP"

# 1. نصب Dependencies
echo ""
echo "1️⃣  نصب Dependencies..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential software-properties-common nginx postgresql postgresql-contrib redis-server

# نصب Node.js
if ! command -v node &> /dev/null; then
    info "نصب Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# نصب Go
if ! command -v go &> /dev/null; then
    info "نصب Go..."
    wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz
    sudo rm -rf /usr/local/go
    sudo tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz
    rm go1.21.5.linux-amd64.tar.gz
    export PATH=$PATH:/usr/local/go/bin
    echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
fi

# نصب PM2
if ! command -v pm2 &> /dev/null; then
    info "نصب PM2..."
    sudo npm install -g pm2
fi

success "Dependencies نصب شد"

# 2. راه‌اندازی PostgreSQL
echo ""
echo "2️⃣  راه‌اندازی PostgreSQL..."

# دریافت password از کاربر
read -sp "Enter PostgreSQL password for 'fariima' user: " DB_PASSWORD
echo ""

sudo -u postgres psql << EOF
SELECT 'CREATE DATABASE fariima_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'fariima_db')\gexec
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'fariima') THEN
    CREATE USER fariima WITH PASSWORD '$DB_PASSWORD';
  END IF;
END
\$\$;
GRANT ALL PRIVILEGES ON DATABASE fariima_db TO fariima;
\c fariima_db
GRANT ALL ON SCHEMA public TO fariima;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
EOF

success "PostgreSQL آماده است"

# 3. راه‌اندازی Redis
echo ""
echo "3️⃣  راه‌اندازی Redis..."
sudo systemctl start redis-server
sudo systemctl enable redis-server
success "Redis آماده است"

# 4. کلون پروژه
echo ""
echo "4️⃣  دانلود پروژه..."

if [ -d "/var/www/fariima" ]; then
    info "پروژه از قبل وجود دارد، pull می‌کنیم..."
    cd /var/www/fariima
    git pull origin main
else
    sudo mkdir -p /var/www
    cd /var/www
    sudo git clone https://github.com/arashdm2020/Friima.git fariima
    sudo chown -R $USER:$USER /var/www/fariima
fi

success "پروژه دانلود شد"

# 5. راه‌اندازی Backend
echo ""
echo "5️⃣  راه‌اندازی Backend..."
cd /var/www/fariima/backend

# ایجاد .env
cat > .env << EOF
PORT=8080
GIN_MODE=release
DB_HOST=localhost
DB_PORT=5432
DB_USER=fariima
DB_PASSWORD=$DB_PASSWORD
DB_NAME=fariima_db
DB_SSLMODE=disable
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
POLYGON_RPC_URL=https://polygon-rpc.com
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRATION_HOURS=168
INDEXER_POLL_INTERVAL=10
INDEXER_START_BLOCK=0
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60
CORS_ALLOWED_ORIGINS=http://$SERVER_IP,https://*
LOG_LEVEL=info
EOF

# Build
go mod download
go build -o bin/fariima-api ./cmd/api

# ایجاد systemd service
sudo tee /etc/systemd/system/fariima-api.service > /dev/null << EOF
[Unit]
Description=FARIIMA API Server
After=network.target postgresql.service redis-server.service

[Service]
Type=simple
User=$USER
WorkingDirectory=/var/www/fariima/backend
ExecStart=/var/www/fariima/backend/bin/fariima-api
Restart=on-failure
RestartSec=5s
Environment="PATH=/usr/local/go/bin:/usr/bin:/bin"

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable fariima-api
sudo systemctl start fariima-api

success "Backend آماده است"

# 6. راه‌اندازی Frontend
echo ""
echo "6️⃣  راه‌اندازی Frontend..."
cd /var/www/fariima/frontend

# ایجاد .env.production
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=http://$SERVER_IP:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://$SERVER_IP:8080/api/v1/ws
NEXT_PUBLIC_CHAIN_ID=80001
NEXT_PUBLIC_RPC_URL=https://rpc-mumbai.maticvigil.com
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
NEXT_PUBLIC_APP_NAME=FARIIMA
NEXT_PUBLIC_APP_URL=http://$SERVER_IP
EOF

# Build و اجرا
npm install
npm run build
pm2 delete fariima-frontend 2>/dev/null || true
pm2 start npm --name "fariima-frontend" -- start
pm2 save
pm2 startup | tail -1 | sudo bash

success "Frontend آماده است"

# 7. تنظیم Nginx
echo ""
echo "7️⃣  تنظیم Nginx..."

sudo tee /etc/nginx/sites-available/fariima > /dev/null << 'EOF'
upstream fariima_api {
    server 127.0.0.1:8080;
}

upstream fariima_frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name _;
    
    client_max_body_size 10M;

    location / {
        proxy_pass http://fariima_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://fariima_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/v1/ws {
        proxy_pass http://fariima_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400;
    }

    location /health {
        proxy_pass http://fariima_api/health;
        access_log off;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/fariima /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

success "Nginx تنظیم شد"

# 8. Firewall
echo ""
echo "8️⃣  تنظیم Firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    success "Firewall تنظیم شد"
else
    info "UFW نصب نیست، skip شد"
fi

# 9. نمایش وضعیت
echo ""
echo "================================"
success "دیپلوی با موفقیت انجام شد! ✨"
echo ""
info "وضعیت سرویس‌ها:"
echo ""
sudo systemctl status fariima-api --no-pager -l | head -3
pm2 status | grep fariima-frontend
sudo systemctl status nginx --no-pager -l | head -3
echo ""
info "پلتفرم در دسترس است:"
echo "  🌐 Frontend: http://$SERVER_IP"
echo "  🔌 API: http://$SERVER_IP/api/v1/health"
echo ""
info "برای مشاهده لاگ‌ها:"
echo "  Backend: sudo journalctl -u fariima-api -f"
echo "  Frontend: pm2 logs fariima-frontend"
echo "  Nginx: sudo tail -f /var/log/nginx/error.log"
echo ""
