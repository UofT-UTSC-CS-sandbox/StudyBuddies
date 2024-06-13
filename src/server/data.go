package main

import (
	"context"
	"fmt"
	"log"

	"github.com/VibeMerchants/StudyBuddies/config"
	"github.com/VibeMerchants/StudyBuddies/model"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type data struct {
	DB *gorm.DB
}

func NewData(ctx context.Context, cfg config.Config) (*data, error) {
	log.Printf("Creating new data")

	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL))

	if err != nil {
		return nil, fmt.Errorf("failed to open database: %v", err)
	}

	if err = db.AutoMigrate(
		&model.User{},
	); err != nil {
		return nil, fmt.Errorf("failed to migrate database: %v", err)
	}

	return &data{
		DB: db,
	}, nil

}
