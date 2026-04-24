# Roadmap Migrasi NexaTools ke Go Murni (AI-Executable)

## 1) Tujuan
Migrasi seluruh fitur NexaTools ke stack Go murni untuk backend logic, dengan aplikasi desktop berbasis Wails sebagai shell UI.

## 2) Prinsip Eksekusi (Wajib untuk Agent AI)
- Kerjakan per task ID, jangan lompat dependency.
- Setiap task harus menghasilkan output file/kode yang jelas.
- Setelah task selesai, jalankan command verifikasi di task tersebut.
- Jika verifikasi gagal, fix dulu sebelum lanjut task berikutnya.
- Jangan melakukan rewrite besar tanpa test minimal.
- Semua tool upload wajib pakai batas ukuran, timeout, dan cleanup file sementara.

## 3) Definisi Selesai Global (Global DoD)
- Semua tool punya kontrak input/output yang terdokumentasi.
- Semua kategori fitur punya integration test minimal happy-path.
- Fitur yang butuh binary eksternal punya health-check dan error message yang jelas.
- Build desktop Wails berhasil untuk Linux/Windows/macOS.
- Tidak ada panic di runtime normal flow.

## 4) Arsitektur Target
- `internal/app`: bootstrap app, dependency wiring.
- `internal/bindings`: Wails bindings, input validation, orchestration.
- `internal/core`: business logic per domain (`pdf`, `image`, `text`, `calc`, `sheet`, `media`, dst).
- `internal/infra`: filesystem sandbox, temp manager, process runner, adapter binary eksternal.
- `internal/contracts`: DTO input/output + error schema.
- `frontend`: UI Wails (boleh incremental, fokus backend parity dulu).

## 5) Eksternal Dependency Strategy
- Native Go dulu jika memungkinkan.
- Jika kualitas/fitur tidak cukup, gunakan adapter external binary:
  - `ffmpeg` (audio/video)
  - `tesseract` (OCR image/PDF)
  - Optional: `libreoffice`, `ghostscript`, `poppler`, `qpdf`, `odafc`
- Setiap adapter wajib:
  - `CheckInstalled()`
  - `Version()`
  - Error standar: `DEPENDENCY_NOT_FOUND`, `PROCESS_FAILED`, `UNSUPPORTED_INPUT`

## 6) Execution Plan (Phase-by-Phase)

## Phase 0 - Foundation
### T0-1 Project skeleton clean architecture
- Depends on: none
- Output: struktur folder `internal/*` + wiring awal `main.go`
- DoD: app run tanpa fitur bisnis
- Verify:
  - `go test ./...`
  - `go build ./...`

### T0-2 Unified error + response envelope
- Depends on: T0-1
- Output: format response standar (`success`, `data`, `error`, `trace_id`)
- DoD: semua binding method pakai format yang sama
- Verify:
  - `go test ./...`

### T0-3 Temp file manager + size limit + timeout middleware
- Depends on: T0-1
- Output: manager file sementara, limit upload, context timeout
- DoD: request besar ditolak, file temp terhapus otomatis
- Verify:
  - `go test ./... -run Temp`

### T0-4 Tool registry + capability manifest
- Depends on: T0-2
- Output: registry metadata tool (id, kategori, status, dependency)
- DoD: method `ListTools()` menampilkan status aktif/nonaktif
- Verify:
  - `go test ./... -run Registry`

## Phase 1 - Quick Wins (MVP parity cepat)

### T1-1 Text & Data tools
- Scope: JSON formatter, Base64, URL encode, word counter, case converter, slug, lorem, csv/json
- Depends on: T0-4
- DoD: semua tool text berjalan tanpa binary eksternal
- Verify:
  - `go test ./... -run Text`

### T1-2 Calculators
- Scope: calculator engine, unit converter, percentage, date calc, timestamp, number base
- Depends on: T0-4
- DoD: output konsisten untuk test vector utama
- Verify:
  - `go test ./... -run Calc`

### T1-3 Security basic
- Scope: password generator, hash text, file hash
- Depends on: T0-3
- DoD: hash akurat MD5/SHA1/SHA256/SHA512
- Verify:
  - `go test ./... -run Security`

### T1-4 QR/Barcode basic
- Scope: generate QR, read QR, generate barcode populer
- Depends on: T0-4
- DoD: file output valid PNG/SVG
- Verify:
  - `go test ./... -run QR`

### T1-5 Archive basic
- Scope: create zip, extract zip, zip info
- Depends on: T0-3
- DoD: proteksi path traversal saat extract
- Verify:
  - `go test ./... -run Archive`

## Phase 2 - PDF core

### T2-1 PDF merge/split/rotate/extract images
- Depends on: T0-3
- DoD: support multi-file input untuk merge
- Verify:
  - `go test ./... -run PDFCore`

### T2-2 PDF protect/unlock/page-number/sign
- Depends on: T2-1
- DoD: protect/unlock valid, sign posisi sesuai parameter
- Verify:
  - `go test ./... -run PDFSecure`

### T2-3 PDF compress/resize
- Depends on: T2-1
- DoD: mode low/medium/high + resize paper preset
- Verify:
  - `go test ./... -run PDFOptimize`

## Phase 3 - Image core

### T3-1 Resize/compress/convert/crop/rotate/flip/watermark/exif/favicon
- Depends on: T0-3
- DoD: dukung PNG/JPG/WebP/BMP/TIFF sesuai scope
- Verify:
  - `go test ./... -run ImageCore`

### T3-2 SVG to PNG + SVG optimizer
- Depends on: T3-1
- DoD: rasterisasi sesuai width + optimizer mengurangi size
- Verify:
  - `go test ./... -run SVG`

### T3-3 Color palette + animated gif/webp convert
- Depends on: T3-1
- DoD: palette 2-16 warna + timing frame tetap
- Verify:
  - `go test ./... -run ImageAdvanced`

## Phase 4 - Spreadsheet

### T4-1 Excel to CSV/JSON + CSV/JSON to Excel
- Depends on: T0-3
- DoD: single/all-sheet + ZIP output
- Verify:
  - `go test ./... -run SheetConvert`

### T4-2 Merge/split/info/preview/csv toolkit
- Depends on: T4-1
- DoD: merge multi workbook + preview N rows
- Verify:
  - `go test ./... -run SheetOps`

### T4-3 Excel to PDF
- Depends on: T4-1
- DoD: output readable (bukan pixel-perfect)
- Verify:
  - `go test ./... -run SheetPDF`

## Phase 5 - Conversion heavy

### T5-1 Files to PDF (image/txt/docx)
- Depends on: T2-1
- DoD: image+txt native Go, docx via adapter jika perlu
- Verify:
  - `go test ./... -run ConvertToPDF`

### T5-2 PDF to text/images/excel
- Depends on: T2-1, T4-1
- DoD: fallback line extraction saat table tidak ditemukan
- Verify:
  - `go test ./... -run PDFExtract`

### T5-3 HTML/Markdown to PDF + Markdown to DOCX
- Depends on: T5-1
- DoD: pagination stabil untuk dokumen panjang
- Verify:
  - `go test ./... -run MarkupConvert`

### T5-4 PDF to Word
- Depends on: T5-2
- DoD: struktur heading/paragraf minimal terjaga
- Verify:
  - `go test ./... -run PDFToWord`

## Phase 6 - OCR + CAD + AI-dependent

### T6-1 OCR image + OCR PDF (searchable)
- Depends on: T5-2
- DoD: minimal 14 language pack terdeteksi jika tersedia
- Verify:
  - `go test ./... -run OCR`

### T6-2 Remove background (AI)
- Depends on: T3-1
- DoD: mode local model atau external service adapter
- Verify:
  - `go test ./... -run RemoveBG`

### T6-3 CAD to PDF/PNG (DXF, optional DWG)
- Depends on: T5-1
- DoD: DXF jalan; DWG graceful fallback jika converter tidak ada
- Verify:
  - `go test ./... -run CAD`

## Phase 7 - Media tools

### T7-1 Audio/video convert/extract/trim/compress/video->gif
- Depends on: T0-3
- DoD: ffmpeg adapter stabil + preset codec per target
- Verify:
  - `go test ./... -run MediaCore`

### T7-2 Subtitle convert + burn subtitles
- Depends on: T7-1
- DoD: SRT/VTT convert dan hardsub berhasil
- Verify:
  - `go test ./... -run Subtitle`

## Phase 8 - Dev utilities

### T8-1 UUID/JWT/User-Agent/SQL/XML/HTML/CSS/JS/Cron/JSONPath
- Depends on: T1-1
- DoD: semua utility dev parity terhadap fitur lama
- Verify:
  - `go test ./... -run DevTools`

## Phase 9 - Wails integration + release hardening

### T9-1 Bind semua services ke Wails frontend
- Depends on: Phase 1-8 minimal 80% selesai
- DoD: UI bisa trigger tool dan unduh hasil
- Verify:
  - `wails dev` (manual smoke)

### T9-2 Telemetry/logging/trace-id
- Depends on: T0-2
- DoD: request traceable dari UI ke backend
- Verify:
  - `go test ./... -run Observability`

### T9-3 Packaging multi-platform
- Depends on: T9-1
- DoD: build Linux/Windows/macOS + dependency checklist
- Verify:
  - `./scripts/build-all.sh`

## 7) Parallel Worklane untuk Multi-Agent AI
- Lane A (Core): T0, T1, T8
- Lane B (PDF): T2, T5
- Lane C (Image): T3, T6-2
- Lane D (Spreadsheet): T4
- Lane E (Media): T7
- Lane F (Infra/Release): T9

Aturan paralel:
- Tidak boleh edit file yang sama di lane berbeda dalam waktu bersamaan.
- Gunakan ownership folder:
  - Lane A: `internal/core/text`, `internal/core/calc`, `internal/core/security`, `internal/core/dev`
  - Lane B: `internal/core/pdf`, `internal/core/convert`
  - Lane C: `internal/core/image`, `internal/core/ocr`
  - Lane D: `internal/core/sheet`
  - Lane E: `internal/core/media`
  - Lane F: `internal/app`, `internal/bindings`, `scripts`, packaging

## 8) Template Task untuk Agent AI (Copy-Paste)
Gunakan template ini untuk setiap eksekusi:

```md
Task ID: <ID>
Goal: <hasil yang diinginkan>
Input: <file/path/contract>
Output:
- <file A>
- <file B>
Steps:
1. Implement ...
2. Add/adjust tests ...
3. Run verify commands ...
Definition of Done:
- ...
Verify Commands:
- go test ./... -run <Pattern>
- go build ./...
Notes/Risks:
- ...
```

## 9) Prioritas Eksekusi Minggu 1-2 (Start Here)
1. T0-1
2. T0-2
3. T0-3
4. T0-4
5. T1-1
6. T1-2
7. T1-3
8. T1-4
9. T1-5

Target akhir minggu 2:
- Kategori Text/Data, Calc, Security, QR, Archive sudah usable end-to-end.

## 10) Risk Register
- Kualitas konversi dokumen kompleks bisa berbeda dari Python stack lama.
- OCR/CAD/Media sangat tergantung tool eksternal per OS.
- Beberapa fitur mungkin butuh fallback mode atau status `partially_supported`.

## 11) Kebijakan Compatibility
- Pertahankan ID tool lama agar UI mapping tidak rusak.
- Jika output format berubah, wajib beri `versioned response`.
- Tambahkan flag capability di `ListTools()` untuk fitur nonaktif karena dependency hilang.
