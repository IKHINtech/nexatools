package bindings

import (
	"context"
	"os"
	"testing"
	"time"

	appbootstrap "nexatools/internal/app"
	"nexatools/internal/core/archive"
	"nexatools/internal/core/calc"
	"nexatools/internal/core/qr"
	"nexatools/internal/core/security"
	"nexatools/internal/core/text"
	"nexatools/internal/infra/temp"
	"nexatools/internal/infra/toolregistry"
)

func newTestApp(t *testing.T, maxBytes int64, timeout time.Duration) *App {
	t.Helper()

	tempManager, err := temp.NewManager(t.TempDir(), maxBytes, timeout)
	if err != nil {
		t.Fatalf("NewManager() error = %v", err)
	}

	return &App{
		ctx: context.Background(),
		bootstrap: &appbootstrap.Bootstrap{
			Services: appbootstrap.Services{
				Text:     text.NewService(),
				Calc:     calc.NewService(),
				Security: security.NewService(),
				Archive:  archive.NewService(),
				QR:       qr.NewService(),
			},
			TempManager: tempManager,
			Registry:    toolregistry.New(nil),
		},
	}
}

func TestTempBindingsRejectOversizedFile(t *testing.T) {
	app := newTestApp(t, 4, time.Second)
	path := t.TempDir() + "/large.txt"
	if err := os.WriteFile(path, []byte("12345"), 0o600); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}

	result := app.SecurityHashFile("sha256", path)
	if result.Success {
		t.Fatalf("SecurityHashFile() success = true, want false")
	}
	if result.Error == nil || result.Error.Code != "INPUT_TOO_LARGE" {
		t.Fatalf("SecurityHashFile() error = %+v, want INPUT_TOO_LARGE", result.Error)
	}
}

func TestTempBindingsArchiveUsesManagedOutputDir(t *testing.T) {
	app := newTestApp(t, 1024, time.Second)
	srcDir := t.TempDir()
	srcFile := srcDir + "/sample.txt"
	if err := os.WriteFile(srcFile, []byte("zip me"), 0o600); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}

	zipResult := app.ArchiveCreateZIP("", []string{srcFile})
	if !zipResult.Success || zipResult.Data == nil {
		t.Fatalf("ArchiveCreateZIP() = %+v, want success with path", zipResult)
	}
	if _, err := os.Stat(*zipResult.Data); err != nil {
		t.Fatalf("created zip missing: %v", err)
	}

	extractResult := app.ArchiveExtractZIP(*zipResult.Data, "")
	if !extractResult.Success || extractResult.Data == nil {
		t.Fatalf("ArchiveExtractZIP() = %+v, want success with dir", extractResult)
	}
	if _, err := os.Stat(*extractResult.Data + "/sample.txt"); err != nil {
		t.Fatalf("extracted file missing: %v", err)
	}
}
