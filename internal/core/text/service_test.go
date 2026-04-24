package text

import (
	"strings"
	"testing"
)

func TestTextJSONRoundTrip(t *testing.T) {
	svc := NewService()

	formatted, err := svc.FormatJSON(`{"name":"tool","count":2}`, "  ")
	if err != nil {
		t.Fatalf("FormatJSON() error = %v", err)
	}
	if !strings.Contains(formatted, "\n  \"name\": \"tool\"") {
		t.Fatalf("FormatJSON() output = %q", formatted)
	}

	minified, err := svc.MinifyJSON(formatted)
	if err != nil {
		t.Fatalf("MinifyJSON() error = %v", err)
	}
	if minified != `{"count":2,"name":"tool"}` && minified != `{"name":"tool","count":2}` {
		t.Fatalf("MinifyJSON() output = %q", minified)
	}
}

func TestTextTransformsAndStats(t *testing.T) {
	svc := NewService()

	if got := svc.Base64Encode("hello"); got != "aGVsbG8=" {
		t.Fatalf("Base64Encode() = %q", got)
	}
	if got, err := svc.Base64Decode("aGVsbG8="); err != nil || got != "hello" {
		t.Fatalf("Base64Decode() = %q, %v", got, err)
	}
	if got := svc.URLEncode("hello world"); got != "hello+world" {
		t.Fatalf("URLEncode() = %q", got)
	}
	if got := svc.ConvertCase("hello world test", "camel"); got != "helloWorldTest" {
		t.Fatalf("ConvertCase() = %q", got)
	}
	if got := svc.Slug("Hello, World Test!"); got != "hello-world-test" {
		t.Fatalf("Slug() = %q", got)
	}

	stats := svc.CountWords("Hello world.\n\nThis is text!")
	if stats.Words != 5 || stats.Sentences != 2 || stats.Paragraphs != 2 {
		t.Fatalf("CountWords() = %+v", stats)
	}
}

func TestTextCSVJSONAndLorem(t *testing.T) {
	svc := NewService()

	jsonOut, err := svc.CSVToJSON("name,age\nana,20\nbudi,30\n")
	if err != nil {
		t.Fatalf("CSVToJSON() error = %v", err)
	}
	if !strings.Contains(jsonOut, `"name": "ana"`) || !strings.Contains(jsonOut, `"age": "30"`) {
		t.Fatalf("CSVToJSON() output = %q", jsonOut)
	}

	csvOut, err := svc.JSONToCSV(`[{"name":"ana","age":20},{"name":"budi","age":30}]`)
	if err != nil {
		t.Fatalf("JSONToCSV() error = %v", err)
	}
	if !strings.Contains(csvOut, "age,name") || !strings.Contains(csvOut, "20,ana") {
		t.Fatalf("JSONToCSV() output = %q", csvOut)
	}

	lorem := svc.Lorem(2, 1, 3)
	if strings.Count(lorem, "\n\n") != 1 || !strings.HasSuffix(lorem, ".") {
		t.Fatalf("Lorem() output = %q", lorem)
	}
}
