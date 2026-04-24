# NexaTools

Desktop toolkit berbasis Go + Wails untuk berbagai utilitas harian seperti text/data tools, kalkulator, security helpers, QR/barcode, dan archive tools.

Project ini sedang dimigrasikan ke stack Go murni untuk backend logic, dengan frontend React + TypeScript yang berjalan di atas Wails. Roadmap eksekusi ada di [roadmap.md](/media/irprogrammer/DATA/Project/wails/usefullTools/roadmap.md:1).

## Status

Yang sudah tersedia saat ini:
- Foundation backend (`internal/app`, `internal/bindings`, `internal/contracts`, `internal/infra`)
- Unified response envelope: `success`, `data`, `error`, `trace_id`
- Tool registry + `ListTools()`
- Temp manager, size limit, timeout, dan managed temp workspace untuk flow file-based
- Frontend desktop untuk fitur yang sudah selesai di backend

Phase yang sudah selesai:
- Phase 0
- Phase 1

Fitur yang sudah jalan sekarang:
- Text & Data
  - JSON formatter / minifier
  - CSV / JSON
  - Base64
  - URL encode / decode
  - Word counter
  - Case converter
  - Slug generator
  - Lorem ipsum
- Calculators
  - Basic calculator
  - Unit converter
  - Percentage calculator
  - Date calculator
  - Timestamp converter
  - Number base converter
- Security
  - Password generator
  - Hash text
  - File hash
- QR & Barcodes
  - Generate QR
  - Read QR
  - Generate barcode SVG (`code39`, `ean13`)
- Archive Tools
  - Create ZIP
  - Extract ZIP
  - ZIP info

## Tech Stack

- Go `1.23`
- Wails `v2.12.0`
- React `18`
- TypeScript `5`
- Vite `5`
- Tailwind CSS `4`
- shadcn/ui primitives

Library backend yang dipakai saat ini:
- `github.com/google/uuid`
- `github.com/tuotoo/qrcode`
- `rsc.io/qr`

## Development

Jalankan mode development desktop:

```bash
wails dev
```

Kalau hanya ingin build frontend:

```bash
cd frontend
npm install
npm run build
```

Verifikasi backend:

```bash
go test ./...
go build ./...
```

Verifikasi kategori Phase 1:

```bash
go test ./... -run Text
go test ./... -run Calc
go test ./... -run Security
go test ./... -run QR
go test ./... -run Archive
```

## Build

Build app untuk platform saat ini:

```bash
wails build
```

Script build yang tersedia:

```bash
./scripts/build.sh
./scripts/build-all.sh
./scripts/build-linux.sh
./scripts/build-windows.sh
./scripts/build-macos-arm.sh
./scripts/build-macos-intel.sh
./scripts/build-macos-universal.sh
```

## Project Structure

```text
.
├── main.go                     # Entry point Wails
├── roadmap.md                  # Roadmap migrasi dan execution plan
├── frontend/
│   ├── src/
│   │   ├── App.tsx             # Frontend shell/orchestration
│   │   ├── components/ui/      # shadcn-style UI primitives
│   │   └── features/phase-one/ # Komponen fitur frontend yang sudah dipisah per kategori
│   ├── wailsjs/                # Generated bindings dari Wails
│   └── package.json
├── internal/
│   ├── app/                    # Bootstrap dan dependency wiring
│   ├── bindings/               # Wails bindings
│   ├── contracts/              # Response envelope / DTO
│   ├── core/
│   │   ├── archive/
│   │   ├── calc/
│   │   ├── qr/
│   │   ├── security/
│   │   └── text/
│   └── infra/
│       ├── temp/               # Temp manager, size limit, timeout
│       └── toolregistry/       # Capability manifest / registry
└── scripts/                    # Build scripts lintas platform
```

## Frontend Notes

Frontend saat ini:
- memakai shell desktop bernuansa Spotify
- sudah modular per kategori
- menampilkan hasil tool dalam envelope backend mentah
- mendukung file picker / drag-drop untuk input file-based tertentu

Catatan output file:
- jika `Output path` dikosongkan, backend akan memakai managed temp workspace
- path hasil aktual akan muncul di field `data` pada panel hasil

## Backend Conventions

Semua binding mengikuti kontrak yang sama:

```json
{
  "success": true,
  "data": "...",
  "error": null,
  "trace_id": "..."
}
```

Untuk flow file-based:
- input besar akan ditolak oleh size limit
- operasi dibungkus timeout
- output path boleh kosong agar backend membuat lokasi sementara yang aman

## Roadmap

Dokumen utama untuk pengembangan:
- [roadmap.md](/media/irprogrammer/DATA/Project/wails/usefullTools/roadmap.md:1)
- [frontend/feature.md](/media/irprogrammer/DATA/Project/wails/usefullTools/frontend/feature.md:1)

Roadmap backend saat ini:
- Phase 0: selesai
- Phase 1: selesai
- Next: phase berikutnya sesuai `roadmap.md`

## License

Belum ditetapkan di repo ini.
