package temp

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestTempManagerRejectsOversizedPayload(t *testing.T) {
	mgr, err := NewManager(t.TempDir(), 4, 20*time.Millisecond)
	if err != nil {
		t.Fatalf("NewManager() error = %v", err)
	}

	if err := mgr.CheckSize(5); !errors.Is(err, ErrSizeLimitExceeded) {
		t.Fatalf("CheckSize() error = %v, want ErrSizeLimitExceeded", err)
	}
}

func TestTempManagerCleansUpWorkspace(t *testing.T) {
	mgr, err := NewManager(t.TempDir(), 32, 20*time.Millisecond)
	if err != nil {
		t.Fatalf("NewManager() error = %v", err)
	}

	workspace, err := mgr.CreateWorkspace("temp-test-")
	if err != nil {
		t.Fatalf("CreateWorkspace() error = %v", err)
	}
	filePath, err := mgr.WriteFile(workspace, "example.txt", []byte("data"))
	if err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}
	if _, err := os.Stat(filePath); err != nil {
		t.Fatalf("written file missing: %v", err)
	}

	if err := mgr.Cleanup(workspace); err != nil {
		t.Fatalf("Cleanup() error = %v", err)
	}
	if _, err := os.Stat(filepath.Dir(filePath)); !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("workspace still exists, stat err = %v", err)
	}
}

func TestTempManagerContextTimeout(t *testing.T) {
	mgr, err := NewManager(t.TempDir(), 32, 10*time.Millisecond)
	if err != nil {
		t.Fatalf("NewManager() error = %v", err)
	}

	ctx, cancel := mgr.ContextWithTimeout(context.Background())
	defer cancel()

	<-ctx.Done()
	if !errors.Is(ctx.Err(), context.DeadlineExceeded) {
		t.Fatalf("ctx.Err() = %v, want DeadlineExceeded", ctx.Err())
	}
}
