# 🚀 راهنمای سریع Deploy

## دو روش برای Deploy:

---

## 🎯 روش 1: اسکریپت خودکار (ساده‌تر)

### از روی کامپیوتر خودتان:

```bash
cd /home/arash/frima
./deploy-remote.sh
```

اسکریپت از شما می‌پرسد:
1. نام کاربری SSH (پیش‌فرض: root)
2. رمز عبور PostgreSQL

سپس تمام کارها را خودکار انجام می‌دهد:
- ✅ نصب Dependencies
- ✅ راه‌اندازی PostgreSQL و Redis
- ✅ Build و Deploy Backend
- ✅ Build و Deploy Frontend
- ✅ تنظیم Nginx
- ✅ تنظیم Firewall

---

## 🛠️ روش 2: دستی (کنترل بیشتر)

### 1. اتصال به سرور:
```bash
ssh root@82.115.13.174
```

### 2. دانلود اسکریپت:
```bash
cd /tmp
wget https://raw.githubusercontent.com/arashdm2020/Friima/main/deploy.sh
chmod +x deploy.sh
```

### 3. اجرا:
```bash
./deploy.sh
```

---

## 📋 قبل از شروع:

### چیزهایی که نیاز دارید:
1. ✅ دسترسی SSH به سرور (82.115.13.174)
2. ✅ دسترسی root یا sudo
3. ✅ Ubuntu 20.04/22.04 روی سرور
4. ✅ حداقل 2GB RAM
5. ✅ اتصال اینترنت پایدار

### اطلاعاتی که باید آماده کنید:
- رمز عبور PostgreSQL (یک رمز قوی)
- (اختیاری) Domain اگر SSL می‌خواهید

---

## ✅ بعد از Deploy:

### چک کردن:
```bash
# Frontend
curl http://82.115.13.174

# API
curl http://82.115.13.174/api/v1/health

# وضعیت سرویس‌ها
ssh root@82.115.13.174
sudo systemctl status fariima-api
pm2 status
sudo systemctl status nginx
```

### مشاهده لاگ‌ها:
```bash
# Backend
sudo journalctl -u fariima-api -f

# Frontend
pm2 logs fariima-frontend

# Nginx
sudo tail -f /var/log/nginx/error.log
```

---

## 🔄 بروزرسانی:

```bash
ssh root@82.115.13.174
cd /var/www/fariima
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

## 🆘 رفع مشکلات:

### اگر Backend کار نمی‌کند:
```bash
sudo journalctl -u fariima-api -n 100
# بررسی .env در /var/www/fariima/backend
# چک کردن PostgreSQL
```

### اگر Frontend کار نمی‌کند:
```bash
pm2 logs fariima-frontend --lines 100
# بررسی .env.production
# چک کردن port 3000
```

### اگر Nginx Error می‌دهد:
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

---

## 📞 دستورات مفید:

```bash
# ری‌استارت همه چیز
ssh root@82.115.13.174 << 'EOF'
sudo systemctl restart fariima-api
pm2 restart fariima-frontend
sudo systemctl restart nginx
EOF

# مشاهده وضعیت
ssh root@82.115.13.174 << 'EOF'
echo "=== Backend ==="
sudo systemctl status fariima-api --no-pager -l | head -5
echo ""
echo "=== Frontend ==="
pm2 status | grep fariima
echo ""
echo "=== Nginx ==="
sudo systemctl status nginx --no-pager -l | head -5
EOF
```

---

## 🔒 امنیت:

بعد از deploy:
1. ✅ تغییر رمز عبور root
2. ✅ تنظیم SSH key (بدون password)
3. ✅ غیرفعال کردن login با password
4. ✅ نصب fail2ban
5. ✅ بروزرسانی منظم سیستم

---

## 📚 اطلاعات بیشتر:

مستندات کامل: `DEPLOYMENT_GUIDE.md`

---

**ساخته شده برای FARIIMA Platform 🚀**
