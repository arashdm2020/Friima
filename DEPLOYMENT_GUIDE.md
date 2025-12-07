# 🚀 FARIIMA Deployment Guide

## سرور: 82.115.13.174

---

## 📋 پیش‌نیازها

### روی سرور نیاز است:
- Ubuntu 20.04/22.04 LTS
- RAM: حداقل 2GB
- CPU: حداقل 2 Core
- Storage: حداقل 20GB
- Domain (اختیاری برای SSL)

---

## 🛠️ مراحل نصب

### 1️⃣ اتصال به سرور

```bash
ssh root@82.115.13.174
# یا
ssh username@82.115.13.174
```

### 2️⃣ نصب Dependencies

```bash
# بروزرسانی سیستم
sudo apt update && sudo apt upgrade -y

# نصب ابزارهای پایه
sudo apt install -y curl wget git build-essential software-properties-common

# نصب Nginx
sudo apt install -y nginx

# نصب PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# نصب Redis
sudo apt install -y redis-server

# نصب Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# نصب Go 1.21
wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc
go version

# نصب PM2 (برای مدیریت Node.js)
sudo npm install -g pm2
```

### 3️⃣ کلون کردن پروژه

```bash
# ایجاد دایرکتوری
sudo mkdir -p /var/www
cd /var/www

# کلون پروژه
sudo git clone https://github.com/arashdm2020/Friima.git fariima
cd fariima

# تنظیم دسترسی‌ها
sudo chown -R $USER:$USER /var/www/fariima
```

---

## 🗄️ راه‌اندازی PostgreSQL

### ایجاد Database و User

```bash
# ورود به PostgreSQL
sudo -u postgres psql

# در PostgreSQL:
CREATE DATABASE fariima_db;
CREATE USER fariima WITH PASSWORD 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE fariima_db TO fariima;
\c fariima_db
GRANT ALL ON SCHEMA public TO fariima;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
\q
```

### تنظیم دسترسی از راه دور (اختیاری)

```bash
# ویرایش فایل تنظیمات
sudo nano /etc/postgresql/*/main/postgresql.conf
# تغییر:
# listen_addresses = 'localhost'
# به:
# listen_addresses = '*'

# ویرایش authentication
sudo nano /etc/postgresql/*/main/pg_hba.conf
# اضافه کردن:
# host    fariima_db    fariima    0.0.0.0/0    md5

# ری‌استارت
sudo systemctl restart postgresql
```

---

## 🔴 راه‌اندازی Redis

```bash
# بررسی وضعیت
sudo systemctl status redis-server

# تنظیمات امنیتی (اختیاری)
sudo nano /etc/redis/redis.conf
# تنظیم password:
# requirepass YOUR_REDIS_PASSWORD

# ری‌استارت
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

---

## 🔧 راه‌اندازی Backend (Go)

### 1. ساخت و تنظیم

```bash
cd /var/www/fariima/backend

# کپی و ویرایش .env
cp .env.example .env
nano .env
```

### محتوای `.env`:

```bash
# Server
PORT=8080
GIN_MODE=release

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=fariima
DB_PASSWORD=YOUR_SECURE_PASSWORD
DB_NAME=fariima_db
DB_SSLMODE=disable

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Blockchain
POLYGON_RPC_URL=https://polygon-rpc.com
ESCROW_CONTRACT=0x...
FARI_TOKEN_CONTRACT=0x...
DAO_CONTRACT=0x...
NFT_CONTRACT=0x...

# IPFS
PINATA_API_KEY=your_key
PINATA_SECRET_KEY=your_secret

# JWT
JWT_SECRET=your_random_secret_key_here_make_it_long_and_secure
JWT_EXPIRATION_HOURS=168

# Indexer
INDEXER_POLL_INTERVAL=10
INDEXER_START_BLOCK=0

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# CORS
CORS_ALLOWED_ORIGINS=http://82.115.13.174,https://yourdomain.com

# Logging
LOG_LEVEL=info
```

### 2. Build و Run

```bash
# دانلود dependencies
go mod download

# Build
go build -o bin/fariima-api ./cmd/api

# تست اجرا
./bin/fariima-api
```

### 3. ایجاد Systemd Service

```bash
sudo nano /etc/systemd/system/fariima-api.service
```

```ini
[Unit]
Description=FARIIMA API Server
After=network.target postgresql.service redis-server.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/fariima/backend
ExecStart=/var/www/fariima/backend/bin/fariima-api
Restart=on-failure
RestartSec=5s
Environment="PATH=/usr/local/go/bin:/usr/bin:/bin"

[Install]
WantedBy=multi-user.target
```

```bash
# فعال‌سازی و شروع
sudo systemctl daemon-reload
sudo systemctl enable fariima-api
sudo systemctl start fariima-api
sudo systemctl status fariima-api

# مشاهده لاگ‌ها
sudo journalctl -u fariima-api -f
```

---

## ⚛️ راه‌اندازی Frontend (Next.js)

### 1. تنظیمات

```bash
cd /var/www/fariima/frontend

# کپی و ویرایش .env
cp .env.example .env.production
nano .env.production
```

### محتوای `.env.production`:

```bash
NEXT_PUBLIC_API_URL=http://82.115.13.174:8080/api/v1
NEXT_PUBLIC_WS_URL=ws://82.115.13.174:8080/api/v1/ws
NEXT_PUBLIC_CHAIN_ID=80001
NEXT_PUBLIC_RPC_URL=https://rpc-mumbai.maticvigil.com
NEXT_PUBLIC_ESCROW_CONTRACT=
NEXT_PUBLIC_FARI_TOKEN_CONTRACT=
NEXT_PUBLIC_DAO_CONTRACT=
NEXT_PUBLIC_NFT_CONTRACT=
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
NEXT_PUBLIC_APP_NAME=FARIIMA
NEXT_PUBLIC_APP_URL=http://82.115.13.174
```

### 2. Build و Run

```bash
# نصب dependencies
npm install

# Build
npm run build

# با PM2
pm2 start npm --name "fariima-frontend" -- start
pm2 save
pm2 startup
```

---

## 🌐 تنظیمات Nginx

### 1. ایجاد Configuration

```bash
sudo nano /etc/nginx/sites-available/fariima
```

```nginx
# Backend API
upstream fariima_api {
    server 127.0.0.1:8080;
}

# Frontend
upstream fariima_frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name 82.115.13.174;
    
    client_max_body_size 10M;

    # Frontend
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

    # API
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

    # WebSocket
    location /api/v1/ws {
        proxy_pass http://fariima_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }

    # Health check
    location /health {
        proxy_pass http://fariima_api/health;
        access_log off;
    }
}
```

### 2. فعال‌سازی

```bash
# لینک به sites-enabled
sudo ln -s /etc/nginx/sites-available/fariima /etc/nginx/sites-enabled/

# حذف default
sudo rm /etc/nginx/sites-enabled/default

# تست تنظیمات
sudo nginx -t

# ری‌استارت
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 🔒 نصب SSL (اختیاری - با Domain)

```bash
# نصب Certbot
sudo apt install -y certbot python3-certbot-nginx

# دریافت Certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🔥 تنظیمات Firewall

```bash
# فعال‌سازی UFW
sudo ufw enable

# اجازه دسترسی
sudo ufw allow 22/tcp       # SSH
sudo ufw allow 80/tcp       # HTTP
sudo ufw allow 443/tcp      # HTTPS
sudo ufw allow 8080/tcp     # API (optional - برای debug)

# وضعیت
sudo ufw status
```

---

## 📊 Monitoring و Logs

### Backend Logs:
```bash
sudo journalctl -u fariima-api -f
```

### Frontend Logs:
```bash
pm2 logs fariima-frontend
```

### Nginx Logs:
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### PostgreSQL Logs:
```bash
sudo tail -f /var/log/postgresql/postgresql-*-main.log
```

---

## 🔄 بروزرسانی پروژه

```bash
cd /var/www/fariima

# Pull تغییرات جدید
git pull origin main

# Backend
cd backend
go build -o bin/fariima-api ./cmd/api
sudo systemctl restart fariima-api

# Frontend
cd ../frontend
npm install
npm run build
pm2 restart fariima-frontend
```

---

## ✅ چک‌لیست نهایی

- [ ] PostgreSQL راه‌اندازی شد
- [ ] Redis راه‌اندازی شد
- [ ] Backend build شد و سرویس فعال است
- [ ] Frontend build شد و با PM2 اجرا می‌شود
- [ ] Nginx تنظیم و فعال است
- [ ] Firewall تنظیم شد
- [ ] دسترسی به `http://82.115.13.174` موفقیت‌آمیز است
- [ ] API در `http://82.115.13.174/api/v1/health` پاسخ می‌دهد
- [ ] WebSocket کار می‌کند
- [ ] Database migration اجرا شد

---

## 🆘 رفع مشکلات

### Backend شروع نمی‌شود:
```bash
sudo journalctl -u fariima-api -n 50
# چک کردن .env
# چک کردن اتصال به PostgreSQL
```

### Frontend Error:
```bash
pm2 logs fariima-frontend --lines 50
# چک کردن .env.production
# چک کردن اتصال به API
```

### Nginx Error:
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Database Connection Error:
```bash
sudo -u postgres psql -c "SELECT 1;"
# تست اتصال
```

---

## 📞 دستورات مفید

```bash
# وضعیت سرویس‌ها
sudo systemctl status fariima-api
sudo systemctl status postgresql
sudo systemctl status redis-server
sudo systemctl status nginx
pm2 status

# ری‌استارت همه
sudo systemctl restart fariima-api
pm2 restart fariima-frontend
sudo systemctl restart nginx

# مشاهده منابع
htop
df -h
free -h
```

---

**ساخته شده برای FARIIMA Platform 🚀**
