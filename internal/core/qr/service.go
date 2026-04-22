package qr

import (
	"fmt"
	"image"
	"os"

	skipqr "github.com/skip2/go-qrcode"
	tuoqr "github.com/tuotoo/qrcode"
)

type Service struct{}

func NewService() *Service { return &Service{} }

func (s *Service) GeneratePNG(content string, size int, outputPath string) error {
	if size <= 0 {
		size = 256
	}
	return skipqr.WriteFile(content, skipqr.Medium, size, outputPath)
}

func (s *Service) ReadFromImage(path string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer f.Close()
	matrix, err := tuoqr.Decode(f)
	if err == nil {
		return matrix.Content, nil
	}

	// fallback: decode through image reader to provide clearer error path
	f2, err2 := os.Open(path)
	if err2 != nil {
		return "", err2
	}
	defer f2.Close()
	_, _, imgErr := image.Decode(f2)
	if imgErr != nil {
		return "", fmt.Errorf("invalid image: %w", imgErr)
	}
	return "", fmt.Errorf("qr decode failed: %w", err)
}
