# 🗄️ راهنمای راه‌اندازی PostgreSQL

## روش‌های راه‌اندازی

### روش 1️⃣: استفاده از اسکریپت خودکار (توصیه می‌شود) ⭐

این اسکریپت تمام کارها را به صورت خودکار انجام می‌دهد:

```bash
cd /home/arash/frima/backend

# 1. ایجاد فایل .env از نمونه
cp .env.example .env

# 2. ویرایش تنظیمات (پسورد دیتابیس را تنظیم کنید)
nano .env

# 3. اجرای اسکریپت راه‌اندازی
make setup-db
```

**این اسکریپت:**
- ✅ وجود PostgreSQL را چک می‌کند
- ✅ وضعیت سرویس را بررسی می‌کند
- ✅ کاربر دیتابیس را می‌سازد
- ✅ دیتابیس را ایجاد می‌کند
- ✅ دسترسی‌ها را تنظیم می‌کند
- ✅ Extensions لازم را فعال می‌کند
- ✅ اتصال را تست می‌کند
- ✅ جداول را می‌سازد

---

### روش 2️⃣: فقط چک کردن PostgreSQL

```bash
make check-postgres
```

این دستور:
- نصب PostgreSQL را چک می‌کند
- وضعیت سرویس را نمایش می‌دهد
- نسخه را نشان می‌دهد

---

### روش 3️⃣: راه‌اندازی دستی گام به گام

#### گام 1: چک کردن PostgreSQL

```bash
# چک نصب
psql --version

# چک سرویس
sudo systemctl status postgresql

# اگر سرویس متوقف است:
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### گام 2: ایجاد کاربر و دیتابیس

```bash
# ورود به PostgreSQL
sudo -u postgres psql

# در داخل PostgreSQL:
CREATE USER fariima WITH PASSWORD 'your_password';
CREATE DATABASE fariima_db OWNER fariima;
GRANT ALL PRIVILEGES ON DATABASE fariima_db TO fariima;
\c fariima_db
GRANT ALL ON SCHEMA public TO fariima;
\q
```

#### گام 3: فعال‌سازی Extensions

```bash
sudo -u postgres psql -d fariima_db

-- در داخل PostgreSQL:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
\q
```

#### گام 4: تست اتصال

```bash
# ویرایش .env و تنظیم پسورد
nano .env

# تست اتصال
PGPASSWORD=your_password psql -h localhost -U fariima -d fariima_db -c "SELECT 1;"
```

#### گام 5: ایجاد جداول

```bash
# با استفاده از migration
make migrate-up

# یا اجرای مستقیم برنامه (جداول خودکار ساخته می‌شوند)
make run
```

---

## 🛠️ دستورات مفید Makefile

```bash
# چک کردن PostgreSQL
make check-postgres

# راه‌اندازی کامل دیتابیس
make setup-db

# ایجاد جداول
make migrate-up

# حذف جداول
make migrate-down

# حذف و ایجاد مجدد همه جداول
make migrate-fresh
```

---

## 🔧 دستورات مستقیم Migration

```bash
cd /home/arash/frima/backend

# ایجاد جداول
go run cmd/migrate/main.go up

# حذف جداول
go run cmd/migrate/main.go down

# حذف و ایجاد مجدد
go run cmd/migrate/main.go fresh
```

---

## 📋 جداول ایجاد شده

پس از اجرای migration، این جداول ساخته می‌شوند:

1. **users** - اطلاعات کاربران
2. **follows** - رابطه دنبال‌کنندگان
3. **projects** - پروژه‌ها
4. **applications** - درخواست‌های کار
5. **reviews** - نظرات و امتیازات
6. **escrows** - قراردادهای اسکرو
7. **escrow_events** - رویدادهای اسکرو
8. **disputes** - اختلافات
9. **evidence** - مدارک اختلافات
10. **votes** - آرای DAO
11. **nfts** - گواهی‌نامه‌های NFT

---

## 🔍 بررسی وضعیت دیتابیس

### اتصال به دیتابیس:

```bash
# با کاربر fariima
PGPASSWORD=your_password psql -h localhost -U fariima -d fariima_db

# یا با کاربر postgres
sudo -u postgres psql -d fariima_db
```

### دستورات مفید در PostgreSQL:

```sql
-- لیست جداول
\dt

-- ساختار یک جدول
\d users

-- تعداد رکوردها
SELECT COUNT(*) FROM users;

-- لیست دیتابیس‌ها
\l

-- خروج
\q
```

---

## 🐛 رفع مشکلات رایج

### مشکل 1: PostgreSQL نصب نیست

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Fedora/RHEL/CentOS
sudo dnf install postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql

# Arch Linux
sudo pacman -S postgresql
sudo -u postgres initdb -D /var/lib/postgres/data
sudo systemctl start postgresql
```

### مشکل 2: سرویس PostgreSQL اجرا نمی‌شود

```bash
# شروع سرویس
sudo systemctl start postgresql

# فعال‌سازی در بوت
sudo systemctl enable postgresql

# بررسی لاگ‌ها
sudo journalctl -u postgresql -n 50
```

### مشکل 3: خطای دسترسی (peer authentication)

اگر خطای `Peer authentication failed` دریافت کردید:

```bash
# ویرایش فایل pg_hba.conf
sudo nano /etc/postgresql/*/main/pg_hba.conf

# تغییر خط:
# local   all   all   peer
# به:
# local   all   all   md5

# یا اضافه کردن:
host    fariima_db    fariima    127.0.0.1/32    md5

# ری‌استارت PostgreSQL
sudo systemctl restart postgresql
```

### مشکل 4: نمی‌توانم به دیتابیس وصل شوم

```bash
# چک پورت
sudo netstat -plnt | grep 5432

# چک تنظیمات listen_addresses
sudo grep listen_addresses /etc/postgresql/*/main/postgresql.conf

# اگر فقط localhost است:
# listen_addresses = 'localhost'
# برای دسترسی از خارج تغییر دهید به:
# listen_addresses = '*'
```

### مشکل 5: Extension نصب نمی‌شود

```bash
# نصب postgresql-contrib
sudo apt install postgresql-contrib  # Ubuntu/Debian
sudo dnf install postgresql-contrib  # Fedora/RHEL

# سپس مجدد extension را فعال کنید
```

---

## ✅ چک‌لیست راه‌اندازی

- [ ] PostgreSQL نصب شده است
- [ ] سرویس PostgreSQL در حال اجرا است
- [ ] فایل `.env` ایجاد و تنظیم شده
- [ ] کاربر دیتابیس ساخته شده
- [ ] دیتابیس ایجاد شده
- [ ] دسترسی‌ها تنظیم شده
- [ ] Extensions فعال شده
- [ ] اتصال تست شده
- [ ] جداول ایجاد شده

---

## 🚀 اجرای برنامه

پس از راه‌اندازی موفق دیتابیس:

```bash
# اجرای مستقیم
make run

# یا با Docker
make docker-up
```

برنامه به صورت خودکار:
- به دیتابیس متصل می‌شود
- جداول را می‌سازد (اگر نباشند)
- سرور API را روی پورت 8080 راه‌اندازی می‌کند

---

## 📞 کمک بیشتر

اگر مشکلی پیش آمد:

1. لاگ‌های PostgreSQL را بررسی کنید:
   ```bash
   sudo tail -f /var/log/postgresql/postgresql-*.log
   ```

2. تنظیمات `.env` را دوباره چک کنید

3. دستور `make check-postgres` را اجرا کنید

4. اسکریپت `setup-db.sh` را مجدد اجرا کنید

---

**ساخته شده با ❤️ برای FARIIMA**
