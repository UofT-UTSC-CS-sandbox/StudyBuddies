package config

import (
	"context"
	"fmt"

	"github.com/joho/godotenv"
	"github.com/sethvargo/go-envconfig"
)

type Config struct {
	DatabaseURL string `env:"DATABASE_URL,required"`
    RedisURL string `env:"REDIS_URL,required"`
}

func LoadConfig(ctx context.Context) (config Config, err error) {

	err = godotenv.Load()

	if err != nil {
		return
	}

	err = envconfig.Process(ctx, &config)

	fmt.Println("Database URL: ", config.DatabaseURL)

	if err != nil {
		return
	}

	return
}
