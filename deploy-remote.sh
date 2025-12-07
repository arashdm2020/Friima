#!/bin/bash

# FARIIMA Remote Deployment Script
# این اسکریپت را روی کامپیوتر خود اجرا کنید
# پروژه را روی سرور دیپلوی می‌کند

set -e

SERVER_IP="82.115.13.174"

echo "🚀 FARIIMA Remote Deployment"
echo "=============================="
echo ""
echo "سرور: $SERVER_IP"
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

# بررسی ابزارها
if ! command -v ssh &> /dev/null; then
    error "SSH نصب نیست!"
    exit 1
fi

if ! command -v scp &> /dev/null; then
    error "SCP نصب نیست!"
    exit 1
fi

# دریافت اطلاعات ورود
echo "اطلاعات ورود به سرور:"
read -p "نام کاربری (root): " SSH_USER
SSH_USER=${SSH_USER:-root}

read -sp "رمز عبور PostgreSQL (برای ایجاد database): " DB_PASSWORD
echo ""

# تست اتصال
info "تست اتصال به سرور..."
if ! ssh -o ConnectTimeout=5 -o BatchMode=yes $SSH_USER@$SERVER_IP exit 2>/dev/null; then
    info "برای اتصال به سرور نیاز به وارد کردن رمز عبور دارید"
fi

# آپلود اسکریپت deploy
info "آپلود فایل‌های deployment..."
scp deploy.sh $SSH_USER@$SERVER_IP:/tmp/deploy.sh

# اجرای deploy روی سرور
info "اجرای deployment روی سرور..."
ssh $SSH_USER@$SERVER_IP "bash -s" <<EOF
set -e

# رنگ‌ها
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

success() {
    echo -e "\${GREEN}✓ \$1\${NC}"
}

error() {
    echo -e "\${RED}✗ \$1\${NC}"
}

info() {
    echo -e "\${YELLOW}ℹ \$1\${NC}"
}

export DB_PASSWORD="$DB_PASSWORD"
export SERVER_IP="$SERVER_IP"

info "شروع deployment..."
chmod +x /tmp/deploy.sh
/tmp/deploy.sh

success "Deployment کامل شد!"
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "================================"
    success "دیپلوی با موفقیت انجام شد! ✨"
    echo ""
    info "پلتفرم شما آماده است:"
    echo "  🌐 Frontend: http://$SERVER_IP"
    echo "  🔌 API Health: http://$SERVER_IP/api/v1/health"
    echo ""
    info "برای مشاهده لاگ‌ها:"
    echo "  ssh $SSH_USER@$SERVER_IP"
    echo "  sudo journalctl -u fariima-api -f"
    echo ""
else
    error "خطا در deployment!"
    exit 1
fi
