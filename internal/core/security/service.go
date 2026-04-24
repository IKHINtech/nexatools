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
	sets := make([]string, 0, 4)
	if useLower {
		sets = append(sets, "abcdefghijklmnopqrstuvwxyz")
	}
	if useUpper {
		sets = append(sets, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
	}
	if useDigits {
		sets = append(sets, "0123456789")
	}
	if useSymbols {
		sets = append(sets, "!@#$%^&*()-_=+[]{}|;:,.<>?/")
	}
	if len(sets) == 0 {
		return "", fmt.Errorf("character pool is empty")
	}
	if length < len(sets) {
		return "", fmt.Errorf("length must be at least %d", len(sets))
	}

	pool := ""
	for _, set := range sets {
		pool += set
	}

	b := make([]byte, length)
	for i, set := range sets {
		ch, err := randomChar(set)
		if err != nil {
			return "", err
		}
		b[i] = ch
	}
	for i := len(sets); i < length; i++ {
		ch, err := randomChar(pool)
		if err != nil {
			return "", err
		}
		b[i] = ch
	}

	if err := shuffleBytes(b); err != nil {
		return "", err
	}
	return string(b), nil
}

func randomChar(pool string) (byte, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(int64(len(pool))))
	if err != nil {
		return 0, err
	}
	return pool[n.Int64()], nil
}

func shuffleBytes(b []byte) error {
	for i := len(b) - 1; i > 0; i-- {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(i+1)))
		if err != nil {
			return err
		}
		j := int(n.Int64())
		b[i], b[j] = b[j], b[i]
	}
	return nil
}
