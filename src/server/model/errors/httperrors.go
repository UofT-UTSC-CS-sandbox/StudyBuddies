package StudyBuddyErrors

import (
	"errors"
	"fmt"
	"net/http"
)

type errorType string

/*
* Errors are values in GO, so we use pointers cuz errors can be nil
* This avoids confusing value usage (i.e. error != -1 or error != 0, etc)
 */

// Error types
const (
	Authorization        errorType = "AUTHORIZATION"          //401
	Conflict             errorType = "CONFLICT"               //409
	Internal             errorType = "INTERNAL"               //500
	NotFound             errorType = "NOT_FOUND"              //404
	BadRequest           errorType = "BAD_REQUEST"            //400
	PayloadTooLarge      errorType = "PAYLOAD_TOO_LARGE"      //413
	ServiceUnavailable   errorType = "SERVICE_UNAVAILABLE"    //503
	UnsupportedMediaType errorType = "UNSUPPORTED_MEDIA_TYPE" //415
)

// Standard for errors on API responses
type Error struct {
	Type    errorType `json:"type"`
	Message string    `json:"message"`
}

func (e *Error) Error() string {
	return e.Message
}

func (e *Error) Status() int {
	switch e.Type {
	case Authorization:
		return http.StatusUnauthorized
	case Conflict:
		return http.StatusConflict
	case Internal:
		return http.StatusInternalServerError
	case NotFound:
		return http.StatusNotFound
	case BadRequest:
		return http.StatusBadRequest
	case PayloadTooLarge:
		return http.StatusRequestEntityTooLarge
	case ServiceUnavailable:
		return http.StatusServiceUnavailable
	case UnsupportedMediaType:
		return http.StatusUnsupportedMediaType
	default:
		return http.StatusInternalServerError
	}
}

func Status(err error) int {
	var e *Error
	if errors.As(err, &e) {
		return e.Status()
	}
	return http.StatusInternalServerError
}

// Create errors

func NewAuthError(message string) *Error {
	return &Error{
		Type:    Authorization,
		Message: message,
	}
}

func NewBadReqError(message string) *Error {
	return &Error{
		Type:    BadRequest,
		Message: fmt.Sprintf("Bad Request: %s", message),
	}
}

func NewConflictError(target, value string) *Error {
	return &Error{
		Type:    Conflict,
		Message: fmt.Sprintf("The target resource: %s with value: %s already exists", target, value),
	}
}

func NewInternalError() *Error {
	return &Error{
		Type:    Internal,
		Message: ServerError,
	}
}

func NewNotFoundError(target, value string) *Error {
	return &Error{
		Type:    NotFound,
		Message: fmt.Sprintf("The target resource: %s with value: %s was not found", target, value),
	}
}

func NewPayloadTooLargeError(targetSize, maxSize string) *Error {
	return &Error{
		Type:    PayloadTooLarge,
		Message: fmt.Sprintf("The target resource size: %s exceeds the maximum size: %s", targetSize, maxSize),
	}
}

func NewServiceUnavailableError() *Error {
	return &Error{
		Type:    ServiceUnavailable,
		Message: "Service is temporarily unavailable",
	}
}

func NewUnsupportedMediaTypeError(message string) *Error {
	return &Error{
		Type:    UnsupportedMediaType,
		Message: message,
	}
}
