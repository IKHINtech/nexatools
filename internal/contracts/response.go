package contracts

import "github.com/google/uuid"

type ToolError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type ToolResult[T any] struct {
	Success bool       `json:"success"`
	Data    *T         `json:"data,omitempty"`
	Error   *ToolError `json:"error,omitempty"`
	TraceID string     `json:"trace_id"`
}

func Ok[T any](data T) ToolResult[T] {
	return ToolResult[T]{
		Success: true,
		Data:    &data,
		TraceID: uuid.NewString(),
	}
}

func Fail[T any](code, message string) ToolResult[T] {
	return ToolResult[T]{
		Success: false,
		Error:   &ToolError{Code: code, Message: message},
		TraceID: uuid.NewString(),
	}
}
