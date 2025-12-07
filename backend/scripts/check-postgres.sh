#!/bin/bash

# اسکریپت ساده برای چک کردن PostgreSQL

echo "🔍 چک کردن PostgreSQL..."
echo ""

# چک نصب PostgreSQL
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL نصب شده است"
    psql --version
    echo ""
else
    echo "❌ PostgreSQL نصب نیست!"
    echo ""
    echo "برای نصب:"
    echo "  Ubuntu/Debian: sudo apt install postgresql"
    echo "  Fedora/RHEL:   sudo dnf install postgresql-server"
    echo "  Arch Linux:    sudo pacman -S postgresql"
    exit 1
fi

# چک وضعیت سرویس
if systemctl is-active --quiet postgresql; then
    echo "✅ سرویس PostgreSQL در حال اجرا است"
    echo ""
    systemctl status postgresql --no-pager -l
else
    echo "❌ سرویس PostgreSQL در حال اجرا نیست"
    echo ""
    echo "برای راه‌اندازی:"
    echo "  sudo systemctl start postgresql"
    echo "  sudo systemctl enable postgresql"
    exit 1
fi

echo ""
echo "✨ PostgreSQL آماده استفاده است!"
