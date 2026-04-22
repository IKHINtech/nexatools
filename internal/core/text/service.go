package text

import (
	"bytes"
	"encoding/base64"
	"encoding/csv"
	"encoding/json"
	"net/url"
	"regexp"
	"sort"
	"strings"
	"unicode"
)

type Service struct{}

func NewService() *Service { return &Service{} }

func (s *Service) FormatJSON(input string, indent string) (string, error) {
	if indent == "" {
		indent = "  "
	}
	var v any
	if err := json.Unmarshal([]byte(input), &v); err != nil {
		return "", err
	}
	b, err := json.MarshalIndent(v, "", indent)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func (s *Service) MinifyJSON(input string) (string, error) {
	var v any
	if err := json.Unmarshal([]byte(input), &v); err != nil {
		return "", err
	}
	b, err := json.Marshal(v)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func (s *Service) Base64Encode(input string) string {
	return base64.StdEncoding.EncodeToString([]byte(input))
}

func (s *Service) Base64Decode(input string) (string, error) {
	b, err := base64.StdEncoding.DecodeString(input)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func (s *Service) URLEncode(input string) string {
	return url.QueryEscape(input)
}

func (s *Service) URLDecode(input string) (string, error) {
	return url.QueryUnescape(input)
}

type WordStats struct {
	Characters          int `json:"characters"`
	CharactersNoSpaces  int `json:"characters_no_spaces"`
	Words               int `json:"words"`
	Sentences           int `json:"sentences"`
	Paragraphs          int `json:"paragraphs"`
	EstimatedReadingMin int `json:"estimated_reading_min"`
}

func (s *Service) CountWords(input string) WordStats {
	trimmed := strings.TrimSpace(input)
	words := strings.Fields(trimmed)
	sentences := regexp.MustCompile(`[.!?]+`).Split(trimmed, -1)
	sentenceCount := 0
	for _, ss := range sentences {
		if strings.TrimSpace(ss) != "" {
			sentenceCount++
		}
	}
	paragraphs := 0
	for _, p := range strings.Split(trimmed, "\n") {
		if strings.TrimSpace(p) != "" {
			paragraphs++
		}
	}
	charsNoSpaces := 0
	for _, r := range input {
		if !unicode.IsSpace(r) {
			charsNoSpaces++
		}
	}
	readMin := 0
	if len(words) > 0 {
		readMin = (len(words) + 199) / 200
	}
	return WordStats{
		Characters:          len([]rune(input)),
		CharactersNoSpaces:  charsNoSpaces,
		Words:               len(words),
		Sentences:           sentenceCount,
		Paragraphs:          paragraphs,
		EstimatedReadingMin: readMin,
	}
}

func (s *Service) ConvertCase(input, mode string) string {
	switch mode {
	case "upper":
		return strings.ToUpper(input)
	case "lower":
		return strings.ToLower(input)
	case "title":
		parts := strings.Fields(strings.ToLower(input))
		for i := range parts {
			if parts[i] != "" {
				r := []rune(parts[i])
				r[0] = unicode.ToUpper(r[0])
				parts[i] = string(r)
			}
		}
		return strings.Join(parts, " ")
	case "snake":
		return joinTokenized(input, "_")
	case "kebab":
		return joinTokenized(input, "-")
	case "camel":
		t := tokenize(input)
		if len(t) == 0 {
			return ""
		}
		for i := 1; i < len(t); i++ {
			t[i] = strings.Title(t[i])
		}
		return t[0] + strings.Join(t[1:], "")
	case "pascal":
		t := tokenize(input)
		for i := range t {
			t[i] = strings.Title(t[i])
		}
		return strings.Join(t, "")
	default:
		return input
	}
}

func tokenize(input string) []string {
	lower := strings.ToLower(input)
	re := regexp.MustCompile(`[^a-z0-9]+`)
	norm := re.ReplaceAllString(lower, " ")
	return strings.Fields(norm)
}

func joinTokenized(input, sep string) string {
	return strings.Join(tokenize(input), sep)
}

func (s *Service) Slug(input string) string {
	return joinTokenized(input, "-")
}

func (s *Service) Lorem(paragraphs, sentencesPerParagraph, wordsPerSentence int) string {
	if paragraphs <= 0 {
		paragraphs = 1
	}
	if sentencesPerParagraph <= 0 {
		sentencesPerParagraph = 3
	}
	if wordsPerSentence <= 0 {
		wordsPerSentence = 10
	}
	seed := []string{"lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"}
	var out []string
	idx := 0
	for p := 0; p < paragraphs; p++ {
		var sents []string
		for sIdx := 0; sIdx < sentencesPerParagraph; sIdx++ {
			var words []string
			for w := 0; w < wordsPerSentence; w++ {
				words = append(words, seed[idx%len(seed)])
				idx++
			}
			sent := strings.Join(words, " ")
			r := []rune(sent)
			r[0] = unicode.ToUpper(r[0])
			sents = append(sents, string(r)+".")
		}
		out = append(out, strings.Join(sents, " "))
	}
	return strings.Join(out, "\n\n")
}

func (s *Service) CSVToJSON(input string) (string, error) {
	r := csv.NewReader(strings.NewReader(input))
	records, err := r.ReadAll()
	if err != nil {
		return "", err
	}
	if len(records) == 0 {
		return "[]", nil
	}
	headers := records[0]
	rows := make([]map[string]string, 0, len(records)-1)
	for _, row := range records[1:] {
		m := map[string]string{}
		for i, h := range headers {
			if i < len(row) {
				m[h] = row[i]
			} else {
				m[h] = ""
			}
		}
		rows = append(rows, m)
	}
	b, err := json.MarshalIndent(rows, "", "  ")
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func (s *Service) JSONToCSV(input string) (string, error) {
	var rows []map[string]any
	if err := json.Unmarshal([]byte(input), &rows); err != nil {
		return "", err
	}
	if len(rows) == 0 {
		return "", nil
	}
	keySet := map[string]struct{}{}
	for _, row := range rows {
		for k := range row {
			keySet[k] = struct{}{}
		}
	}
	keys := make([]string, 0, len(keySet))
	for k := range keySet {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	buf := &bytes.Buffer{}
	w := csv.NewWriter(buf)
	if err := w.Write(keys); err != nil {
		return "", err
	}
	for _, row := range rows {
		rec := make([]string, len(keys))
		for i, k := range keys {
			if v, ok := row[k]; ok {
				rec[i] = stringify(v)
			}
		}
		if err := w.Write(rec); err != nil {
			return "", err
		}
	}
	w.Flush()
	if err := w.Error(); err != nil {
		return "", err
	}
	return buf.String(), nil
}

func stringify(v any) string {
	switch x := v.(type) {
	case string:
		return x
	default:
		b, _ := json.Marshal(x)
		return string(b)
	}
}
