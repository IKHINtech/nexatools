package app

import (
	"path/filepath"
	"time"

	"nexatools/internal/core/archive"
	"nexatools/internal/core/calc"
	"nexatools/internal/core/qr"
	"nexatools/internal/core/security"
	"nexatools/internal/core/text"
	"nexatools/internal/infra/temp"
	"nexatools/internal/infra/toolregistry"
)

type Services struct {
	Text     *text.Service
	Calc     *calc.Service
	Security *security.Service
	Archive  *archive.Service
	QR       *qr.Service
}

type Bootstrap struct {
	Services    Services
	TempManager *temp.Manager
	Registry    *toolregistry.Registry
}

func NewBootstrap() (*Bootstrap, error) {
	tempManager, err := temp.NewManager(filepath.Join(".", ".tmp"), 10<<20, 30*time.Second)
	if err != nil {
		return nil, err
	}

	return &Bootstrap{
		Services: Services{
			Text:     text.NewService(),
			Calc:     calc.NewService(),
			Security: security.NewService(),
			Archive:  archive.NewService(),
			QR:       qr.NewService(),
		},
		TempManager: tempManager,
		Registry:    toolregistry.New(defaultTools()),
	}, nil
}

func defaultTools() []toolregistry.Tool {
	return []toolregistry.Tool{
		{ID: "archive.create_zip", Category: "archive", Status: toolregistry.StatusActive},
		{ID: "archive.extract_zip", Category: "archive", Status: toolregistry.StatusActive},
		{ID: "archive.zip_info", Category: "archive", Status: toolregistry.StatusActive},
		{ID: "calc.basic", Category: "calc", Status: toolregistry.StatusActive},
		{ID: "calc.date", Category: "calc", Status: toolregistry.StatusActive},
		{ID: "calc.number_base", Category: "calc", Status: toolregistry.StatusActive},
		{ID: "calc.percentage", Category: "calc", Status: toolregistry.StatusActive},
		{ID: "calc.unit", Category: "calc", Status: toolregistry.StatusActive},
		{ID: "qr.generate", Category: "qr", Status: toolregistry.StatusActive},
		{ID: "qr.generate_barcode", Category: "qr", Status: toolregistry.StatusActive},
		{ID: "qr.read", Category: "qr", Status: toolregistry.StatusActive},
		{ID: "security.hash_file", Category: "security", Status: toolregistry.StatusActive},
		{ID: "security.hash_text", Category: "security", Status: toolregistry.StatusActive},
		{ID: "security.password", Category: "security", Status: toolregistry.StatusActive},
		{ID: "text.base64", Category: "text", Status: toolregistry.StatusActive},
		{ID: "text.case_convert", Category: "text", Status: toolregistry.StatusActive},
		{ID: "text.csv_json", Category: "text", Status: toolregistry.StatusActive},
		{ID: "text.json", Category: "text", Status: toolregistry.StatusActive},
		{ID: "text.lorem", Category: "text", Status: toolregistry.StatusActive},
		{ID: "text.slug", Category: "text", Status: toolregistry.StatusActive},
		{ID: "text.url", Category: "text", Status: toolregistry.StatusActive},
		{ID: "text.word_count", Category: "text", Status: toolregistry.StatusActive},
	}
}
