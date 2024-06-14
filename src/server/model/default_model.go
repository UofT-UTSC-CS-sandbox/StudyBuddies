package model

import (
	"time"

	errors "github.com/VibeMerchants/StudyBuddies/model/errors"
)

// A copy of the gorm.Model pretty much

type DefaultModel struct {
	ID        uint      `gorm:"primary_key" json:"id"`
	CreatedAt time.Time `gorm:"index" json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type SuccessResponse struct {
	Success bool `json:"success"`
}

type ErrorResponse struct {
	Error errors.Error `json:"error"`
}
