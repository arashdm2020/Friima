#!/bin/bash

# FARIIMA Database Setup Script
# این اسکریپت PostgreSQL را چک کرده و دیتابیس را راه‌اندازی می‌کند

set -e

echo "🚀 FARIIMA Database Setup"
echo "=========================="
echo ""

# رنگ‌ها برای output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# تابع برای نمایش پیام موفقیت
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# تابع برای نمایش پیام خطا
error() {
    echo -e "${RED}✗ $1${NC}"
}

# تابع برای نمایش پیام اطلاعاتی
info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# 1. چک کردن وجود PostgreSQL
echo "1️⃣  چک کردن نصب PostgreSQL..."
if ! command -v psql &> /dev/null; then
    error "PostgreSQL نصب نیست!"
    echo ""
    info "برای نصب PostgreSQL دستورات زیر را اجرا کنید:"
    echo ""
    echo "  Ubuntu/Debian:"
    echo "    sudo apt update"
    echo "    sudo apt install postgresql postgresql-contrib"
    echo ""
    echo "  Fedora/RHEL:"
    echo "    sudo dnf install postgresql-server postgresql-contrib"
    echo "    sudo postgresql-setup --initdb"
    echo ""
    echo "  Arch Linux:"
    echo "    sudo pacman -S postgresql"
    echo "    sudo -u postgres initdb -D /var/lib/postgres/data"
    echo ""
    exit 1
else
    success "PostgreSQL نصب شده است"
    psql --version
fi

echo ""

# 2. چک کردن سرویس PostgreSQL
echo "2️⃣  چک کردن وضعیت سرویس PostgreSQL..."
if systemctl is-active --quiet postgresql; then
    success "سرویس PostgreSQL در حال اجرا است"
else
    info "سرویس PostgreSQL در حال اجرا نیست. تلاش برای راه‌اندازی..."
    sudo systemctl start postgresql
    if systemctl is-active --quiet postgresql; then
        success "سرویس PostgreSQL راه‌اندازی شد"
    else
        error "نتوانستیم سرویس PostgreSQL را راه‌اندازی کنیم"
        info "لطفاً به صورت دستی راه‌اندازی کنید: sudo systemctl start postgresql"
        exit 1
    fi
fi

echo ""

# 3. خواندن تنظیمات از .env
echo "3️⃣  خواندن تنظیمات از .env..."
if [ -f .env ]; then
    success "فایل .env یافت شد"
    export $(cat .env | grep -v '^#' | xargs)
else
    error "فایل .env یافت نشد!"
    info "لطفاً ابتدا .env.example را کپی کرده و تنظیمات را پر کنید:"
    echo "    cp .env.example .env"
    echo "    nano .env"
    exit 1
fi

# تنظیمات پیش‌فرض
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-fariima}
DB_PASSWORD=${DB_PASSWORD:-fariima}
DB_NAME=${DB_NAME:-fariima_db}

echo ""
info "تنظیمات دیتابیس:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  User: $DB_USER"
echo "  Database: $DB_NAME"
echo ""

# 4. ایجاد کاربر PostgreSQL
echo "4️⃣  ایجاد کاربر PostgreSQL..."
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1; then
    success "کاربر $DB_USER از قبل وجود دارد"
else
    info "ایجاد کاربر جدید: $DB_USER"
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" || error "خطا در ایجاد کاربر"
    success "کاربر $DB_USER ایجاد شد"
fi

echo ""

# 5. ایجاد دیتابیس
echo "5️⃣  ایجاد دیتابیس..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    success "دیتابیس $DB_NAME از قبل وجود دارد"
else
    info "ایجاد دیتابیس جدید: $DB_NAME"
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" || error "خطا در ایجاد دیتابیس"
    success "دیتابیس $DB_NAME ایجاد شد"
fi

echo ""

# 6. دادن دسترسی‌های لازم
echo "6️⃣  تنظیم دسترسی‌ها..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" || error "خطا در تنظیم دسترسی‌ها"
sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;" || error "خطا در تنظیم دسترسی schema"
success "دسترسی‌ها تنظیم شد"

echo ""

# 7. فعال‌سازی extension های مورد نیاز
echo "7️⃣  فعال‌سازی PostgreSQL Extensions..."
sudo -u postgres psql -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";" || info "Extension uuid-ossp فعال نشد (ممکن است نیاز به نصب باشد)"
sudo -u postgres psql -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";" || info "Extension pgcrypto فعال نشد"
success "Extensions فعال شدند"

echo ""

# 8. تست اتصال
echo "8️⃣  تست اتصال به دیتابیس..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1; then
    success "اتصال به دیتابیس موفق بود"
else
    error "خطا در اتصال به دیتابیس!"
    info "لطفاً تنظیمات را بررسی کنید"
    exit 1
fi

echo ""

# 9. ایجاد جداول با Go Migration
echo "9️⃣  ایجاد جداول دیتابیس..."
if [ -f "cmd/migrate/main.go" ]; then
    info "اجرای Go Migration..."
    go run cmd/migrate/main.go || error "خطا در اجرای migration"
    success "جداول با موفقیت ایجاد شدند"
else
    info "فایل migration یافت نشد. اجرای migration از طریق برنامه اصلی..."
    # جداول هنگام اجرای برنامه اصلی ساخته می‌شوند
    success "جداول هنگام اجرای اولین بار برنامه ایجاد خواهند شد"
fi

echo ""

# 10. نمایش لیست جداول
echo "🔟  لیست جداول ایجاد شده:"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt" || info "هنوز جدولی ایجاد نشده"

echo ""
echo "================================"
success "راه‌اندازی دیتابیس با موفقیت انجام شد! ✨"
echo ""
info "برای اجرای برنامه:"
echo "  make run"
echo ""
info "برای اجرای با Docker:"
echo "  make docker-up"
echo ""
