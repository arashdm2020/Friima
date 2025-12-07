package main

import (
	"fmt"
	"log"
	"os"

	"github.com/fariima/backend/internal/config"
	"github.com/fariima/backend/internal/database"
	"github.com/fariima/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func main() {
	fmt.Println("🚀 FARIIMA Database Migration")
	fmt.Println("==============================")
	fmt.Println()

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("❌ Failed to load config: %v", err)
	}

	// Connect to database
	fmt.Println("📡 اتصال به PostgreSQL...")
	dsn := cfg.GetDatabaseDSN()
	
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	
	if err != nil {
		log.Fatalf("❌ خطا در اتصال به دیتابیس: %v", err)
	}
	
	fmt.Println("✅ اتصال موفق به دیتابیس")
	fmt.Println()

	// Get command argument
	command := "up"
	if len(os.Args) > 1 {
		command = os.Args[1]
	}

	switch command {
	case "up":
		migrateUp(db)
	case "down":
		migrateDown(db)
	case "fresh":
		migrateFresh(db)
	default:
		fmt.Println("❌ دستور نامعتبر!")
		fmt.Println("دستورات قابل قبول:")
		fmt.Println("  up    - اجرای migrations (ایجاد جداول)")
		fmt.Println("  down  - برگشت migrations (حذف جداول)")
		fmt.Println("  fresh - حذف و ایجاد مجدد همه جداول")
		os.Exit(1)
	}
}

func migrateUp(db *gorm.DB) {
	fmt.Println("📦 ایجاد جداول...")
	fmt.Println()

	tables := []interface{}{
		&models.User{},
		&models.Follow{},
		&models.Project{},
		&models.Application{},
		&models.Review{},
		&models.Escrow{},
		&models.EscrowEvent{},
		&models.Dispute{},
		&models.Evidence{},
		&models.Vote{},
		&models.NFT{},
	}

	for i, model := range tables {
		modelName := fmt.Sprintf("%T", model)
		fmt.Printf("%d. ایجاد جدول %s... ", i+1, modelName)
		
		if err := db.AutoMigrate(model); err != nil {
			fmt.Printf("❌ خطا: %v\n", err)
		} else {
			fmt.Println("✅")
		}
	}

	fmt.Println()
	fmt.Println("✨ همه جداول با موفقیت ایجاد شدند!")
	fmt.Println()
	
	// نمایش لیست جداول
	listTables(db)
}

func migrateDown(db *gorm.DB) {
	fmt.Println("🗑️  حذف جداول...")
	fmt.Println()

	tables := []interface{}{
		&models.NFT{},
		&models.Vote{},
		&models.Evidence{},
		&models.Dispute{},
		&models.EscrowEvent{},
		&models.Escrow{},
		&models.Review{},
		&models.Application{},
		&models.Project{},
		&models.Follow{},
		&models.User{},
	}

	for i, model := range tables {
		modelName := fmt.Sprintf("%T", model)
		fmt.Printf("%d. حذف جدول %s... ", i+1, modelName)
		
		if err := db.Migrator().DropTable(model); err != nil {
			fmt.Printf("❌ خطا: %v\n", err)
		} else {
			fmt.Println("✅")
		}
	}

	fmt.Println()
	fmt.Println("✨ همه جداول حذف شدند!")
}

func migrateFresh(db *gorm.DB) {
	fmt.Println("🔄 حذف و ایجاد مجدد جداول...")
	fmt.Println()
	
	migrateDown(db)
	fmt.Println()
	migrateUp(db)
}

func listTables(db *gorm.DB) {
	fmt.Println("📋 لیست جداول ایجاد شده:")
	fmt.Println("─────────────────────────────")
	
	var tables []string
	db.Raw("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename").Scan(&tables)
	
	for i, table := range tables {
		fmt.Printf("  %d. %s\n", i+1, table)
	}
	
	fmt.Println("─────────────────────────────")
	fmt.Printf("📊 تعداد کل جداول: %d\n", len(tables))
	fmt.Println()
}
