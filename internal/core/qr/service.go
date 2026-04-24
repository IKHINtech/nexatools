package qr

import (
	"bytes"
	"fmt"
	"image"
	"os"
	"strconv"
	"strings"

	tuoqr "github.com/tuotoo/qrcode"
	rscqr "rsc.io/qr"
)

type Service struct{}

func NewService() *Service { return &Service{} }

func (s *Service) GeneratePNG(content string, size int, outputPath string) error {
	if size <= 0 {
		size = 256
	}
	code, err := rscqr.Encode(content, rscqr.M)
	if err != nil {
		return err
	}
	scale := size / (code.Size + 8)
	if scale <= 0 {
		scale = 1
	}
	code.Scale = scale
	return os.WriteFile(outputPath, code.PNG(), 0o600)
}

func (s *Service) ReadFromImage(path string) (string, error) {
	f, err := os.Open(path)
	if err != nil {
		return "", err
	}
	defer f.Close()
	matrix, err := tuoqr.Decode(f)
	if err == nil {
		return matrix.Content, nil
	}

	// fallback: decode through image reader to provide clearer error path
	f2, err2 := os.Open(path)
	if err2 != nil {
		return "", err2
	}
	defer f2.Close()
	_, _, imgErr := image.Decode(f2)
	if imgErr != nil {
		return "", fmt.Errorf("invalid image: %w", imgErr)
	}
	return "", fmt.Errorf("qr decode failed: %w", err)
}

func (s *Service) GenerateBarcodeSVG(format, content, outputPath string) error {
	svg, err := barcodeSVG(format, content)
	if err != nil {
		return err
	}
	return os.WriteFile(outputPath, []byte(svg), 0o600)
}

func barcodeSVG(format, content string) (string, error) {
	switch strings.ToLower(strings.TrimSpace(format)) {
	case "code39", "code-39":
		modules, err := code39Modules(content)
		if err != nil {
			return "", err
		}
		return renderBarcodeSVG(modules, 4, 120), nil
	case "ean13", "ean-13":
		modules, err := ean13Modules(content)
		if err != nil {
			return "", err
		}
		return renderBarcodeSVG(modules, 3, 120), nil
	default:
		return "", fmt.Errorf("unsupported barcode format")
	}
}

func renderBarcodeSVG(modules []bool, moduleWidth, height int) string {
	var buf bytes.Buffer
	width := len(modules) * moduleWidth
	buf.WriteString(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 `)
	buf.WriteString(strconv.Itoa(width))
	buf.WriteString(" ")
	buf.WriteString(strconv.Itoa(height))
	buf.WriteString(`" width="`)
	buf.WriteString(strconv.Itoa(width))
	buf.WriteString(`" height="`)
	buf.WriteString(strconv.Itoa(height))
	buf.WriteString(`" shape-rendering="crispEdges">`)
	buf.WriteString(`<rect width="100%" height="100%" fill="white"/>`)
	for i, bar := range modules {
		if !bar {
			continue
		}
		buf.WriteString(`<rect x="`)
		buf.WriteString(strconv.Itoa(i * moduleWidth))
		buf.WriteString(`" y="0" width="`)
		buf.WriteString(strconv.Itoa(moduleWidth))
		buf.WriteString(`" height="`)
		buf.WriteString(strconv.Itoa(height))
		buf.WriteString(`" fill="black"/>`)
	}
	buf.WriteString(`</svg>`)
	return buf.String()
}

func code39Modules(content string) ([]bool, error) {
	const narrow = 1
	const wide = 2
	patterns := map[rune]string{
		'0': "nnnwwnwnn", '1': "wnnwnnnnw", '2': "nnwwnnnnw", '3': "wnwwnnnnn",
		'4': "nnnwwnnnw", '5': "wnnwwnnnn", '6': "nnwwwnnnn", '7': "nnnwnnwnw",
		'8': "wnnwnnwnn", '9': "nnwwnnwnn", 'A': "wnnnnwnnw", 'B': "nnwnnwnnw",
		'C': "wnwnnwnnn", 'D': "nnnnwwnnw", 'E': "wnnnwwnnn", 'F': "nnwnwwnnn",
		'G': "nnnnnwwnw", 'H': "wnnnnwwnn", 'I': "nnwnnwwnn", 'J': "nnnnwwwnn",
		'K': "wnnnnnnww", 'L': "nnwnnnnww", 'M': "wnwnnnnwn", 'N': "nnnnwnnww",
		'O': "wnnnwnnwn", 'P': "nnwnwnnwn", 'Q': "nnnnnnwww", 'R': "wnnnnnwwn",
		'S': "nnwnnnwwn", 'T': "nnnnwnwwn", 'U': "wwnnnnnnw", 'V': "nwwnnnnnw",
		'W': "wwwnnnnnn", 'X': "nwnnwnnnw", 'Y': "wwnnwnnnn", 'Z': "nwwnwnnnn",
		'-': "nwnnnnwnw", '.': "wwnnnnwnn", ' ': "nwwnnnwnn", '$': "nwnwnwnnn",
		'/': "nwnwnnnwn", '+': "nwnnnwnwn", '%': "nnnwnwnwn", '*': "nwnnwnwnn",
	}

	encoded := "*" + strings.ToUpper(content) + "*"
	modules := make([]bool, 0, len(encoded)*16)
	for i, ch := range encoded {
		pattern, ok := patterns[ch]
		if !ok {
			return nil, fmt.Errorf("unsupported code39 character: %q", ch)
		}
		for idx, part := range pattern {
			width := narrow
			if part == 'w' {
				width = wide
			}
			bar := idx%2 == 0
			for j := 0; j < width; j++ {
				modules = append(modules, bar)
			}
		}
		if i < len(encoded)-1 {
			modules = append(modules, false)
		}
	}
	return modules, nil
}

func ean13Modules(content string) ([]bool, error) {
	content = strings.TrimSpace(content)
	for _, ch := range content {
		if ch < '0' || ch > '9' {
			return nil, fmt.Errorf("ean13 content must be numeric")
		}
	}
	switch len(content) {
	case 12:
		content += strconv.Itoa(ean13Checksum(content))
	case 13:
		expected := ean13Checksum(content[:12])
		if int(content[12]-'0') != expected {
			return nil, fmt.Errorf("invalid ean13 checksum")
		}
	default:
		return nil, fmt.Errorf("ean13 content must be 12 or 13 digits")
	}

	parity := []string{
		"LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG",
		"LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL",
	}
	leftL := []string{"0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"}
	leftG := []string{"0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"}
	rightR := []string{"1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"}

	var bits strings.Builder
	bits.WriteString("101")
	leftParity := parity[int(content[0]-'0')]
	for i, p := range leftParity {
		digit := int(content[i+1] - '0')
		if p == 'L' {
			bits.WriteString(leftL[digit])
		} else {
			bits.WriteString(leftG[digit])
		}
	}
	bits.WriteString("01010")
	for i := 7; i < 13; i++ {
		digit := int(content[i] - '0')
		bits.WriteString(rightR[digit])
	}
	bits.WriteString("101")

	modules := make([]bool, 0, bits.Len())
	for _, bit := range bits.String() {
		modules = append(modules, bit == '1')
	}
	return modules, nil
}

func ean13Checksum(content string) int {
	sum := 0
	for i, ch := range content {
		n := int(ch - '0')
		if i%2 == 0 {
			sum += n
		} else {
			sum += n * 3
		}
	}
	return (10 - (sum % 10)) % 10
}
