package config

import (
	"context"

	"github.com/sethvargo/go-envconfig"
)

type Config struct {
	DatabaseURL string `env:"DATABASE_URL"`
}

func LoadConfig(ctx context.Context) (config Config, err error) {
	err = envconfig.Process(ctx, &config)

	if err != nil {
		return
	}

	return
}
