package archive

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

type Service struct{}

func NewService() *Service { return &Service{} }

func (s *Service) CreateZIP(outputPath string, inputPaths []string) error {
	out, err := os.Create(outputPath)
	if err != nil {
		return err
	}
	defer out.Close()

	zw := zip.NewWriter(out)
	defer zw.Close()

	for _, p := range inputPaths {
		if err := addPathToZip(zw, p); err != nil {
			return err
		}
	}
	return nil
}

func addPathToZip(zw *zip.Writer, path string) error {
	info, err := os.Stat(path)
	if err != nil {
		return err
	}
	if info.IsDir() {
		return filepath.Walk(path, func(file string, fi os.FileInfo, walkErr error) error {
			if walkErr != nil {
				return walkErr
			}
			if fi.IsDir() {
				return nil
			}
			return addFile(zw, file)
		})
	}
	return addFile(zw, path)
}

func addFile(zw *zip.Writer, path string) error {
	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer f.Close()

	fi, err := f.Stat()
	if err != nil {
		return err
	}
	h, err := zip.FileInfoHeader(fi)
	if err != nil {
		return err
	}
	h.Method = zip.Deflate
	h.Name = filepath.Base(path)
	w, err := zw.CreateHeader(h)
	if err != nil {
		return err
	}
	_, err = io.Copy(w, f)
	return err
}

func (s *Service) ExtractZIP(zipPath, dstDir string) error {
	r, err := zip.OpenReader(zipPath)
	if err != nil {
		return err
	}
	defer r.Close()

	if err := os.MkdirAll(dstDir, 0o755); err != nil {
		return err
	}
	for _, f := range r.File {
		if err := extractFile(f, dstDir); err != nil {
			return err
		}
	}
	return nil
}

func extractFile(f *zip.File, dstDir string) error {
	cleanName := filepath.Clean(f.Name)
	if strings.Contains(cleanName, "..") {
		return fmt.Errorf("invalid zip entry: %s", f.Name)
	}
	target := filepath.Join(dstDir, cleanName)
	if !strings.HasPrefix(target, filepath.Clean(dstDir)+string(os.PathSeparator)) && filepath.Clean(target) != filepath.Clean(dstDir) {
		return fmt.Errorf("zip slip detected: %s", f.Name)
	}

	if f.FileInfo().IsDir() {
		return os.MkdirAll(target, f.Mode())
	}
	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return err
	}
	rc, err := f.Open()
	if err != nil {
		return err
	}
	defer rc.Close()

	out, err := os.OpenFile(target, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, f.Mode())
	if err != nil {
		return err
	}
	defer out.Close()

	_, err = io.Copy(out, rc)
	return err
}

type ZIPEntry struct {
	Name             string `json:"name"`
	CompressedSize   uint64 `json:"compressed_size"`
	UncompressedSize uint64 `json:"uncompressed_size"`
	Modified         string `json:"modified"`
}

func (s *Service) ZIPInfo(zipPath string) ([]ZIPEntry, error) {
	r, err := zip.OpenReader(zipPath)
	if err != nil {
		return nil, err
	}
	defer r.Close()
	entries := make([]ZIPEntry, 0, len(r.File))
	for _, f := range r.File {
		entries = append(entries, ZIPEntry{
			Name:             f.Name,
			CompressedSize:   f.CompressedSize64,
			UncompressedSize: f.UncompressedSize64,
			Modified:         f.Modified.UTC().Format("2006-01-02T15:04:05Z"),
		})
	}
	return entries, nil
}
