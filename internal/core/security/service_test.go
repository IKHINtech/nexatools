package security

import (
	"os"
	"strings"
	"testing"
)

func TestSecurityHashes(t *testing.T) {
	svc := NewService()

	cases := map[string]string{
		"md5":    "5d41402abc4b2a76b9719d911017c592",
		"sha1":   "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d",
		"sha256": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
		"sha512": "9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043",
	}
	for algo, want := range cases {
		got, err := svc.HashText(algo, "hello")
		if err != nil || got != want {
			t.Fatalf("HashText(%q) = %q, %v", algo, got, err)
		}
	}
}

func TestSecurityHashFileAndPassword(t *testing.T) {
	svc := NewService()

	path := t.TempDir() + "/sample.txt"
	if err := os.WriteFile(path, []byte("hello"), 0o600); err != nil {
		t.Fatalf("WriteFile() error = %v", err)
	}
	got, err := svc.HashFile("sha256", path)
	if err != nil || got != "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824" {
		t.Fatalf("HashFile() = %q, %v", got, err)
	}

	password, err := svc.GeneratePassword(12, true, true, true, true)
	if err != nil {
		t.Fatalf("GeneratePassword() error = %v", err)
	}
	if len(password) != 12 {
		t.Fatalf("GeneratePassword() length = %d", len(password))
	}
	if !strings.ContainsAny(password, "abcdefghijklmnopqrstuvwxyz") ||
		!strings.ContainsAny(password, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") ||
		!strings.ContainsAny(password, "0123456789") ||
		!strings.ContainsAny(password, "!@#$%^&*()-_=+[]{}|;:,.<>?/") {
		t.Fatalf("GeneratePassword() missing required classes: %q", password)
	}
}
