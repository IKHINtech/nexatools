package bindings

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"

	"changeme/internal/app"
	"changeme/internal/contracts"
	"changeme/internal/core/archive"
	"changeme/internal/core/text"
	"changeme/internal/infra/toolregistry"
)

type App struct {
	ctx       context.Context
	bootstrap *app.Bootstrap
}

func New(bootstrap *app.Bootstrap) *App {
	return &App{bootstrap: bootstrap}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Startup(ctx context.Context) {
	a.startup(ctx)
}

func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) ListTools() contracts.ToolResult[[]toolregistry.Tool] {
	return contracts.Ok(a.bootstrap.Registry.ListTools())
}

func (a *App) checkInlineSize(input string) error {
	return a.bootstrap.TempManager.CheckSize(int64(len(input)))
}

func (a *App) checkFileSize(path string) error {
	info, err := os.Stat(path)
	if err != nil {
		return err
	}
	if info.IsDir() {
		return nil
	}
	return a.bootstrap.TempManager.CheckSize(info.Size())
}

func (a *App) runWithTimeout(fn func() error) error {
	ctx, cancel := a.bootstrap.TempManager.ContextWithTimeout(a.ctx)
	defer cancel()

	done := make(chan error, 1)
	go func() {
		done <- fn()
	}()

	select {
	case err := <-done:
		return err
	case <-ctx.Done():
		return ctx.Err()
	}
}

func (a *App) ensureWorkspacePath(path, filename string) (string, error) {
	if path != "" {
		return path, nil
	}
	workspace, err := a.bootstrap.TempManager.CreateWorkspace("tool-output-")
	if err != nil {
		return "", err
	}
	return filepath.Join(workspace, filename), nil
}

func (a *App) ensureWorkspaceDir(path, prefix string) (string, error) {
	if path != "" {
		return path, nil
	}
	return a.bootstrap.TempManager.CreateWorkspace(prefix)
}

func (a *App) TextFormatJSON(input, indent string) contracts.ToolResult[string] {
	if err := a.checkInlineSize(input); err != nil {
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	out, err := a.bootstrap.Services.Text.FormatJSON(input, indent)
	if err != nil {
		return contracts.Fail[string]("INVALID_JSON", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) TextMinifyJSON(input string) contracts.ToolResult[string] {
	if err := a.checkInlineSize(input); err != nil {
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	out, err := a.bootstrap.Services.Text.MinifyJSON(input)
	if err != nil {
		return contracts.Fail[string]("INVALID_JSON", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) TextBase64Encode(input string) contracts.ToolResult[string] {
	if err := a.checkInlineSize(input); err != nil {
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	return contracts.Ok(a.bootstrap.Services.Text.Base64Encode(input))
}

func (a *App) TextBase64Decode(input string) contracts.ToolResult[string] {
	if err := a.checkInlineSize(input); err != nil {
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	out, err := a.bootstrap.Services.Text.Base64Decode(input)
	if err != nil {
		return contracts.Fail[string]("INVALID_BASE64", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) TextURLEncode(input string) contracts.ToolResult[string] {
	if err := a.checkInlineSize(input); err != nil {
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	return contracts.Ok(a.bootstrap.Services.Text.URLEncode(input))
}

func (a *App) TextURLDecode(input string) contracts.ToolResult[string] {
	if err := a.checkInlineSize(input); err != nil {
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	out, err := a.bootstrap.Services.Text.URLDecode(input)
	if err != nil {
		return contracts.Fail[string]("INVALID_URL_ENCODED", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) TextWordCount(input string) contracts.ToolResult[text.WordStats] {
	if err := a.checkInlineSize(input); err != nil {
		return contracts.Fail[text.WordStats]("INPUT_TOO_LARGE", err.Error())
	}
	return contracts.Ok(a.bootstrap.Services.Text.CountWords(input))
}

func (a *App) TextConvertCase(input, mode string) contracts.ToolResult[string] {
	if err := a.checkInlineSize(input); err != nil {
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	return contracts.Ok(a.bootstrap.Services.Text.ConvertCase(input, mode))
}

func (a *App) TextSlug(input string) contracts.ToolResult[string] {
	if err := a.checkInlineSize(input); err != nil {
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	return contracts.Ok(a.bootstrap.Services.Text.Slug(input))
}

func (a *App) TextLorem(paragraphs, sentencesPerParagraph, wordsPerSentence int) contracts.ToolResult[string] {
	return contracts.Ok(a.bootstrap.Services.Text.Lorem(paragraphs, sentencesPerParagraph, wordsPerSentence))
}

func (a *App) TextCSVToJSON(input string) contracts.ToolResult[string] {
	if err := a.checkInlineSize(input); err != nil {
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	out, err := a.bootstrap.Services.Text.CSVToJSON(input)
	if err != nil {
		return contracts.Fail[string]("INVALID_CSV", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) TextJSONToCSV(input string) contracts.ToolResult[string] {
	if err := a.checkInlineSize(input); err != nil {
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	out, err := a.bootstrap.Services.Text.JSONToCSV(input)
	if err != nil {
		return contracts.Fail[string]("INVALID_JSON", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) CalcBasic(op string, x, y float64) contracts.ToolResult[float64] {
	out, err := a.bootstrap.Services.Calc.EvalBasic(op, x, y)
	if err != nil {
		return contracts.Fail[float64]("INVALID_CALC_OP", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) CalcUnit(category string, value float64, from, to string) contracts.ToolResult[float64] {
	out, err := a.bootstrap.Services.Calc.ConvertUnit(category, value, from, to)
	if err != nil {
		return contracts.Fail[float64]("INVALID_UNIT_CONVERSION", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) CalcPercentage(mode string, x, y float64) contracts.ToolResult[float64] {
	out, err := a.bootstrap.Services.Calc.Percentage(mode, x, y)
	if err != nil {
		return contracts.Fail[float64]("INVALID_PERCENTAGE_MODE", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) CalcDateDiff(startISO, endISO string) contracts.ToolResult[int] {
	out, err := a.bootstrap.Services.Calc.DateDiff(startISO, endISO)
	if err != nil {
		return contracts.Fail[int]("INVALID_DATE", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) CalcAddDays(dateISO string, days int) contracts.ToolResult[string] {
	out, err := a.bootstrap.Services.Calc.AddDays(dateISO, days)
	if err != nil {
		return contracts.Fail[string]("INVALID_DATE", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) CalcTimestampToISO(ts int64) contracts.ToolResult[string] {
	return contracts.Ok(a.bootstrap.Services.Calc.TimestampToISO(ts))
}

func (a *App) CalcISOToTimestamp(iso string) contracts.ToolResult[int64] {
	out, err := a.bootstrap.Services.Calc.ISOToTimestamp(iso)
	if err != nil {
		return contracts.Fail[int64]("INVALID_ISO_DATE", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) CalcNumberBase(input string, fromBase, toBase int) contracts.ToolResult[string] {
	out, err := a.bootstrap.Services.Calc.NumberBase(input, fromBase, toBase)
	if err != nil {
		return contracts.Fail[string]("INVALID_BASE_NUMBER", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) SecurityPassword(length int, lower, upper, digits, symbols bool) contracts.ToolResult[string] {
	out, err := a.bootstrap.Services.Security.GeneratePassword(length, lower, upper, digits, symbols)
	if err != nil {
		return contracts.Fail[string]("INVALID_PASSWORD_CONFIG", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) SecurityHashText(algorithm, input string) contracts.ToolResult[string] {
	out, err := a.bootstrap.Services.Security.HashText(algorithm, input)
	if err != nil {
		return contracts.Fail[string]("INVALID_HASH_ALGO", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) SecurityHashFile(algorithm, path string) contracts.ToolResult[string] {
	if err := a.checkFileSize(path); err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return contracts.Fail[string]("HASH_FILE_FAILED", err.Error())
		}
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}

	var out string
	err := a.runWithTimeout(func() error {
		var runErr error
		out, runErr = a.bootstrap.Services.Security.HashFile(algorithm, path)
		return runErr
	})
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return contracts.Fail[string]("PROCESS_TIMEOUT", err.Error())
		}
		return contracts.Fail[string]("HASH_FILE_FAILED", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) QRGeneratePNG(content string, size int, outputPath string) contracts.ToolResult[string] {
	if err := a.checkInlineSize(content); err != nil {
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	resolvedOutput, err := a.ensureWorkspacePath(outputPath, "qr.png")
	if err != nil {
		return contracts.Fail[string]("QR_GENERATE_FAILED", err.Error())
	}
	err = a.runWithTimeout(func() error {
		return a.bootstrap.Services.QR.GeneratePNG(content, size, resolvedOutput)
	})
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return contracts.Fail[string]("PROCESS_TIMEOUT", err.Error())
		}
		return contracts.Fail[string]("QR_GENERATE_FAILED", err.Error())
	}
	return contracts.Ok(resolvedOutput)
}

func (a *App) QRGenerateBarcodeSVG(format, content, outputPath string) contracts.ToolResult[string] {
	if err := a.checkInlineSize(content); err != nil {
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	resolvedOutput, err := a.ensureWorkspacePath(outputPath, "barcode.svg")
	if err != nil {
		return contracts.Fail[string]("BARCODE_GENERATE_FAILED", err.Error())
	}
	err = a.runWithTimeout(func() error {
		return a.bootstrap.Services.QR.GenerateBarcodeSVG(format, content, resolvedOutput)
	})
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return contracts.Fail[string]("PROCESS_TIMEOUT", err.Error())
		}
		return contracts.Fail[string]("BARCODE_GENERATE_FAILED", err.Error())
	}
	return contracts.Ok(resolvedOutput)
}

func (a *App) QRReadFromImage(path string) contracts.ToolResult[string] {
	if err := a.checkFileSize(path); err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return contracts.Fail[string]("QR_READ_FAILED", err.Error())
		}
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	var out string
	err := a.runWithTimeout(func() error {
		var runErr error
		out, runErr = a.bootstrap.Services.QR.ReadFromImage(path)
		return runErr
	})
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return contracts.Fail[string]("PROCESS_TIMEOUT", err.Error())
		}
		return contracts.Fail[string]("QR_READ_FAILED", err.Error())
	}
	return contracts.Ok(out)
}

func (a *App) ArchiveCreateZIP(outputPath string, inputPaths []string) contracts.ToolResult[string] {
	for _, inputPath := range inputPaths {
		if err := a.checkFileSize(inputPath); err != nil {
			if errors.Is(err, os.ErrNotExist) {
				return contracts.Fail[string]("ZIP_CREATE_FAILED", err.Error())
			}
			return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
		}
	}
	resolvedOutput, err := a.ensureWorkspacePath(outputPath, "archive.zip")
	if err != nil {
		return contracts.Fail[string]("ZIP_CREATE_FAILED", err.Error())
	}
	err = a.runWithTimeout(func() error {
		return a.bootstrap.Services.Archive.CreateZIP(resolvedOutput, inputPaths)
	})
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return contracts.Fail[string]("PROCESS_TIMEOUT", err.Error())
		}
		return contracts.Fail[string]("ZIP_CREATE_FAILED", err.Error())
	}
	return contracts.Ok(resolvedOutput)
}

func (a *App) ArchiveExtractZIP(zipPath, dstDir string) contracts.ToolResult[string] {
	if err := a.checkFileSize(zipPath); err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return contracts.Fail[string]("ZIP_EXTRACT_FAILED", err.Error())
		}
		return contracts.Fail[string]("INPUT_TOO_LARGE", err.Error())
	}
	resolvedDir, err := a.ensureWorkspaceDir(dstDir, "archive-extract-")
	if err != nil {
		return contracts.Fail[string]("ZIP_EXTRACT_FAILED", err.Error())
	}
	err = a.runWithTimeout(func() error {
		return a.bootstrap.Services.Archive.ExtractZIP(zipPath, resolvedDir)
	})
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return contracts.Fail[string]("PROCESS_TIMEOUT", err.Error())
		}
		return contracts.Fail[string]("ZIP_EXTRACT_FAILED", err.Error())
	}
	return contracts.Ok(resolvedDir)
}

func (a *App) ArchiveZIPInfo(zipPath string) contracts.ToolResult[[]archive.ZIPEntry] {
	if err := a.checkFileSize(zipPath); err != nil {
		if errors.Is(err, os.ErrNotExist) {
			return contracts.Fail[[]archive.ZIPEntry]("ZIP_INFO_FAILED", err.Error())
		}
		return contracts.Fail[[]archive.ZIPEntry]("INPUT_TOO_LARGE", err.Error())
	}
	var entries []archive.ZIPEntry
	err := a.runWithTimeout(func() error {
		var runErr error
		entries, runErr = a.bootstrap.Services.Archive.ZIPInfo(zipPath)
		return runErr
	})
	if err != nil {
		if errors.Is(err, context.DeadlineExceeded) {
			return contracts.Fail[[]archive.ZIPEntry]("PROCESS_TIMEOUT", err.Error())
		}
		return contracts.Fail[[]archive.ZIPEntry]("ZIP_INFO_FAILED", err.Error())
	}
	return contracts.Ok(entries)
}
