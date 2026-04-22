package temp

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

var ErrSizeLimitExceeded = errors.New("size limit exceeded")

type Manager struct {
	baseDir  string
	maxBytes int64
	timeout  time.Duration
}

func NewManager(baseDir string, maxBytes int64, timeout time.Duration) (*Manager, error) {
	if baseDir == "" {
		baseDir = os.TempDir()
	}
	if err := os.MkdirAll(baseDir, 0o755); err != nil {
		return nil, err
	}
	if maxBytes <= 0 {
		maxBytes = 10 << 20
	}
	if timeout <= 0 {
		timeout = 30 * time.Second
	}
	return &Manager{
		baseDir:  baseDir,
		maxBytes: maxBytes,
		timeout:  timeout,
	}, nil
}

func (m *Manager) BaseDir() string {
	return m.baseDir
}

func (m *Manager) MaxBytes() int64 {
	return m.maxBytes
}

func (m *Manager) Timeout() time.Duration {
	return m.timeout
}

func (m *Manager) CheckSize(size int64) error {
	if size > m.maxBytes {
		return fmt.Errorf("%w: %d > %d", ErrSizeLimitExceeded, size, m.maxBytes)
	}
	return nil
}

func (m *Manager) ContextWithTimeout(parent context.Context) (context.Context, context.CancelFunc) {
	if parent == nil {
		parent = context.Background()
	}
	return context.WithTimeout(parent, m.timeout)
}

func (m *Manager) CreateWorkspace(prefix string) (string, error) {
	if prefix == "" {
		prefix = "tool-"
	}
	return os.MkdirTemp(m.baseDir, prefix)
}

func (m *Manager) WriteFile(workspace, name string, data []byte) (string, error) {
	if err := m.CheckSize(int64(len(data))); err != nil {
		return "", err
	}
	if workspace == "" {
		return "", errors.New("workspace is required")
	}
	if err := os.MkdirAll(workspace, 0o755); err != nil {
		return "", err
	}
	target := filepath.Join(workspace, filepath.Base(name))
	if err := os.WriteFile(target, data, 0o600); err != nil {
		return "", err
	}
	return target, nil
}

func (m *Manager) Cleanup(paths ...string) error {
	for _, path := range paths {
		if path == "" {
			continue
		}
		if err := os.RemoveAll(path); err != nil && !errors.Is(err, os.ErrNotExist) {
			return err
		}
	}
	return nil
}
