package qr

import (
	"os"
	"strings"
	"testing"
)

func TestQRGenerateAndReadPNG(t *testing.T) {
	svc := NewService()
	path := t.TempDir() + "/qr.png"

	if err := svc.GeneratePNG("https://example.com", 256, path); err != nil {
		t.Fatalf("GeneratePNG() error = %v", err)
	}
	got, err := svc.ReadFromImage(path)
	if err != nil {
		t.Fatalf("ReadFromImage() error = %v", err)
	}
	if got != "https://example.com" {
		t.Fatalf("ReadFromImage() = %q", got)
	}
}

func TestQRGenerateBarcodeSVG(t *testing.T) {
	svc := NewService()
	path := t.TempDir() + "/barcode.svg"

	if err := svc.GenerateBarcodeSVG("code39", "ABC-123", path); err != nil {
		t.Fatalf("GenerateBarcodeSVG(code39) error = %v", err)
	}
	svg, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("ReadFile() error = %v", err)
	}
	if !strings.Contains(string(svg), "<svg") || !strings.Contains(string(svg), "<rect") {
		t.Fatalf("GenerateBarcodeSVG() output = %q", string(svg))
	}

	if err := svc.GenerateBarcodeSVG("ean13", "590123412345", path); err != nil {
		t.Fatalf("GenerateBarcodeSVG(ean13) error = %v", err)
	}
}
