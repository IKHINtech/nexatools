package archive

import (
	"archive/zip"
	"os"
	"strings"
	"testing"
)

func TestArchiveCreateExtractAndInfo(t *testing.T) {
	svc := NewService()
	root := t.TempDir()
	sourceDir := root + "/input"
	nestedDir := sourceDir + "/nested"
	if err := os.MkdirAll(nestedDir, 0o755); err != nil {
		t.Fatalf("MkdirAll() error = %v", err)
	}
	if err := os.WriteFile(nestedDir+"/hello.txt", []byte("hello"), 0o600); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}

	zipPath := root + "/sample.zip"
	if err := svc.CreateZIP(zipPath, []string{sourceDir}); err != nil {
		t.Fatalf("CreateZIP() error = %v", err)
	}

	entries, err := svc.ZIPInfo(zipPath)
	if err != nil {
		t.Fatalf("ZIPInfo() error = %v", err)
	}
	if len(entries) != 1 || entries[0].Name != "input/nested/hello.txt" {
		t.Fatalf("ZIPInfo() = %+v", entries)
	}

	extractDir := root + "/out"
	if err := svc.ExtractZIP(zipPath, extractDir); err != nil {
		t.Fatalf("ExtractZIP() error = %v", err)
	}
	content, err := os.ReadFile(extractDir + "/input/nested/hello.txt")
	if err != nil || string(content) != "hello" {
		t.Fatalf("ReadFile() = %q, %v", string(content), err)
	}
}

func TestArchiveRejectsPathTraversal(t *testing.T) {
	svc := NewService()
	zipPath := t.TempDir() + "/bad.zip"

	out, err := os.Create(zipPath)
	if err != nil {
		t.Fatalf("Create() error = %v", err)
	}
	zw := zip.NewWriter(out)
	w, err := zw.Create("../evil.txt")
	if err != nil {
		t.Fatalf("Create(zip entry) error = %v", err)
	}
	if _, err := w.Write([]byte("bad")); err != nil {
		t.Fatalf("Write() error = %v", err)
	}
	if err := zw.Close(); err != nil {
		t.Fatalf("Close(zip) error = %v", err)
	}
	if err := out.Close(); err != nil {
		t.Fatalf("Close(file) error = %v", err)
	}

	err = svc.ExtractZIP(zipPath, t.TempDir()+"/out")
	if err == nil || !strings.Contains(err.Error(), "invalid zip entry") {
		t.Fatalf("ExtractZIP() error = %v, want invalid zip entry", err)
	}
}
