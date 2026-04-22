package security

import (
	"crypto/md5"
	"crypto/rand"
	"crypto/sha1"
	"crypto/sha256"
	"crypto/sha512"
	"encoding/hex"
	"fmt"
	"io"
	"math/big"
	"os"
)

type Service struct{}

func NewService() *Service { return &Service{} }

func (s *Service) HashText(algorithm, input string) (string, error) {
	switch algorithm {
	case "md5":
		h := md5.Sum([]byte(input))
		return hex.EncodeToString(h[:]), nil
	case "sha1":
		h := sha1.Sum([]byte(input))
		return hex.EncodeToString(h[:]), nil
	case "sha256":
		h := sha256.Sum256([]byte(input))
		return hex.EncodeToString(h[:]), nil
	case "sha512":
		h := sha512.Sum512([]byte(input))
		return hex.EncodeToString(h[:]), nil
	default:
		return "", fmt.Errorf("unsupported algorithm")
	}
}

func (s *Service) HashFile(algorithm, path string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer f.Close()

	switch algorithm {
	case "md5":
		h := md5.New()
		_, err = io.Copy(h, f)
		if err != nil {
			return "", err
		}
		return hex.EncodeToString(h.Sum(nil)), nil
	case "sha1":
		h := sha1.New()
		_, err = io.Copy(h, f)
		if err != nil {
			return "", err
		}
		return hex.EncodeToString(h.Sum(nil)), nil
	case "sha256":
		h := sha256.New()
		_, err = io.Copy(h, f)
		if err != nil {
			return "", err
		}
		return hex.EncodeToString(h.Sum(nil)), nil
	case "sha512":
		h := sha512.New()
		_, err = io.Copy(h, f)
		if err != nil {
			return "", err
		}
		return hex.EncodeToString(h.Sum(nil)), nil
	default:
		return "", fmt.Errorf("unsupported algorithm")
	}
}

func (s *Service) GeneratePassword(length int, useLower, useUpper, useDigits, useSymbols bool) (string, error) {
	if length <= 0 {
		length = 16
	}
	pool := ""
	if useLower {
		pool += "abcdefghijklmnopqrstuvwxyz"
	}
	if useUpper {
		pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	}
	if useDigits {
		pool += "0123456789"
	}
	if useSymbols {
		pool += "!@#$%^&*()-_=+[]{}|;:,.<>?/"
	}
	if pool == "" {
		return "", fmt.Errorf("character pool is empty")
	}
	b := make([]byte, length)
	for i := 0; i < length; i++ {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(pool))))
		if err != nil {
			return "", err
		}
		b[i] = pool[n.Int64()]
	}
	return string(b), nil
}
