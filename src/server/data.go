package main

import (
	"context"
	"fmt"
	"log"

	"github.com/VibeMerchants/StudyBuddies/config"
	"github.com/VibeMerchants/StudyBuddies/model"
	"gorm.io/driver/postgres"
    "github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type data struct {
	DB *gorm.DB
    RedisClient *redis.Client
}

func NewData(ctx context.Context, cfg config.Config) (*data, error) {
	log.Printf("Creating new data")

	db, err := gorm.Open(postgres.Open(cfg.DatabaseURL))

	if err != nil {
		return nil, fmt.Errorf("failed to open database: %v", err)
	}

	if err = db.AutoMigrate(
		&model.Course{},
        &model.Chat{},
		&model.User{},
        &model.Message{},
	); err != nil {
		return nil, fmt.Errorf("failed to migrate database: %v", err)
	}


    redOpts, err := redis.ParseURL(cfg.RedisURL)

    if err != nil {
        return nil, fmt.Errorf("error parsing the redis url with error: %v", err)
    }


    redis := redis.NewClient(redOpts)

    _, err = redis.Ping(ctx).Result()

    if err != nil {
        return nil, fmt.Errorf("error connexting to redis with error: %v", err)
    }

    

	return &data{
		DB: db,
        RedisClient: redis,
	}, nil

}

func (d *data) close() error {

    if err := d.RedisClient.Close(); err != nil {
        return fmt.Errorf("error closing redis client with error: %v", err)
    }
    
    return nil
}
