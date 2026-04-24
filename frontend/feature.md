
## Features

### Document Conversion

| Tool                 | Description                                                                                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Files to PDF**     | Convert images (JPG, PNG, BMP, TIFF, WebP), Word documents (.docx), and text files to PDF                                                                                                                                        |
| **PDF to Word**      | Convert PDF documents to `.docx` format                                                                                                                                                                                          |
| **PDF to Images**    | Export each PDF page as PNG or JPG (configurable DPI)                                                                                                                                                                            |
| **PDF to Text**      | Extract all text content from a PDF                                                                                                                                                                                              |
| **PDF to Excel**     | Extract tables from a PDF into an `.xlsx` workbook — one sheet per table, per page, or all combined. Falls back to line-by-line text when no tables are detected. Uses PyMuPDF's native `find_tables()` (no extra dependencies). |
| **HTML to PDF**      | Convert HTML content to a PDF document                                                                                                                                                                                           |
| **Markdown to PDF**  | Paste or upload Markdown (.md) and download a formatted PDF. Choose page size and base font size. Uses PyMuPDF's `Story` API for proper multi-page pagination.                                                                   |
| **Markdown to Word** | Convert Markdown to a `.docx` document with correct heading, list, quote, and code styles                                                                                                                                        |
| **OCR PDF**          | Make scanned PDFs searchable (image + hidden text layer) or extract text — 14 languages supported                                                                                                                                |
| **CAD to PDF/Image** | Convert DXF drawings to PDF or PNG (DWG via optional ODA File Converter)                                                                                                                                                         |

### Spreadsheet

| Tool                     | Description                                                                                                                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Excel to CSV / JSON**  | Export sheets from `.xlsx` / `.xls` to CSV or JSON (array-of-objects or array-of-arrays). Single sheet or all sheets as ZIP.                                                                                 |
| **CSV / JSON to Excel**  | Build an `.xlsx` workbook from one or more CSV or JSON files — one sheet per file, optional bold/shaded header row                                                                                           |
| **Excel to PDF**         | Convert a workbook to PDF with one section per sheet. Configurable page size, orientation, and font size. Basic table rendering, not pixel-perfect.                                                          |
| **Merge Workbooks**      | Combine multiple Excel files into a single workbook, optionally prefixing each sheet with its source filename                                                                                                |
| **Split Sheets**         | Export each sheet of a workbook as its own `.xlsx` (bundled as a ZIP if more than one)                                                                                                                       |
| **Excel Info & Preview** | List sheet names, row/column counts, and preview the first N rows of every sheet                                                                                                                             |
| **CSV Toolkit**          | Filter, sort, and de-duplicate CSV rows. Auto-detects delimiter. Filter operators: `=`, `!=`, `contains`, `startswith`, `endswith`, `>`, `>=`, `<`, `<=`, `empty`, `notempty`. Full-row or by-column dedupe. |

### PDF Tools

| Tool               | Description                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **Merge PDFs**     | Combine multiple PDF files into one document                                                            |
| **Split PDF**      | Split a PDF into individual pages or custom page ranges                                                 |
| **Compress PDF**   | Reduce PDF file size (low / medium / high compression)                                                  |
| **Rotate PDF**     | Rotate all or specific pages (90, 180, 270 degrees)                                                     |
| **Resize PDF**     | Scale pages by percentage or fit to standard paper sizes (A3–A5, Letter, Legal)                         |
| **Page Numbers**   | Add page numbers with configurable position, font size, and start number                                |
| **Extract Images** | Extract all embedded images from a PDF                                                                  |
| **Protect PDF**    | Encrypt a PDF with user and owner passwords (AES-256)                                                   |
| **Unlock PDF**     | Remove password protection from a PDF                                                                   |
| **Sign PDF**       | Stamp a signature image (PNG/JPG) onto selected pages with position, width, margin, and opacity control |

### Image Tools

| Tool                    | Description                                                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Resize Image**        | Resize by percentage or exact pixel dimensions (with aspect ratio lock)                                                                 |
| **Compress Image**      | Reduce file size with adjustable quality slider (10–100%)                                                                               |
| **Convert Format**      | Convert between PNG, JPG, WebP, BMP, and TIFF                                                                                           |
| **Remove Background**   | Automatically remove image backgrounds using AI                                                                                         |
| **Crop Image**          | Crop by aspect ratio (1:1, 4:3, 16:9, etc.) or custom coordinates                                                                       |
| **Rotate / Flip**       | Rotate 90/180/270 degrees, flip horizontal or vertical                                                                                  |
| **Add Watermark**       | Add text watermark with configurable position, opacity, size, and tiled mode                                                            |
| **EXIF Viewer**         | View or strip image metadata (EXIF data) for privacy                                                                                    |
| **Favicon Generator**   | Create .ico favicons from any image with multiple size options                                                                          |
| **Image to Text (OCR)** | Extract text from images using optical character recognition                                                                            |
| **Animated WebP/GIF**   | Convert between animated GIF and animated WebP (preserves per-frame timing)                                                             |
| **Color Palette**       | Extract a dominant color palette (2–16 colors) from an image via quantization or grid sampling. Includes swatch preview with hex codes. |
| **SVG to PNG**          | Rasterize SVG vectors to PNG at a chosen width, with optional transparent background                                                    |
| **SVG Optimizer**       | Strip comments, editor metadata (Inkscape/Sketch/Adobe namespaces), and round decimals to shrink SVG files                              |

### Text & Data (client-side, no upload needed)

| Tool                 | Description                                                                        |
| -------------------- | ---------------------------------------------------------------------------------- |
| **JSON Formatter**   | Format, validate, and minify JSON                                                  |
| **CSV / JSON**       | Convert between CSV and JSON in both directions                                    |
| **Base64**           | Encode and decode Base64 strings                                                   |
| **URL Encode**       | Encode and decode URL components                                                   |
| **Word Counter**     | Count words, characters, sentences, paragraphs, and estimate reading time          |
| **Markdown Preview** | Live Markdown-to-HTML preview                                                      |
| **Case Converter**   | Convert between UPPER, lower, Title, camelCase, snake_case, kebab-case, PascalCase |
| **Text Diff**        | Compare two texts side by side with highlighted additions and deletions            |
| **Regex Tester**     | Test regular expressions with live match highlighting and group extraction         |
| **Slug Generator**   | Create URL-friendly slugs from any text                                            |
| **JSON / YAML**      | Convert between JSON and YAML formats                                              |
| **Lorem Ipsum**      | Generate placeholder text by paragraphs, sentences, or words                       |

### Calculators (client-side)

| Tool                      | Description                                                                     |
| ------------------------- | ------------------------------------------------------------------------------- |
| **Calculator**            | Basic + scientific calculator with keyboard support                             |
| **Unit Converter**        | Length, weight, temperature, area, volume, speed, data, and time                |
| **Color Converter**       | Convert between HEX, RGB, and HSL with live preview and color picker            |
| **Percentage Calc**       | Four common percentage calculations in one page                                 |
| **Date Calculator**       | Date difference, add/subtract days, day-of-week lookup                          |
| **Timestamp Converter**   | Convert between Unix timestamps and human-readable dates (local, UTC, ISO 8601) |
| **Number Base Converter** | Convert between decimal, binary, octal, and hexadecimal                         |
| **Pomodoro Timer**        | Focus timer with configurable work/break intervals and session tracking         |

### QR & Barcodes

| Tool                 | Description                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| **Generate QR**      | Create QR codes from text/URLs with custom size, border, and color                                |
| **Read QR**          | Decode QR codes from uploaded images                                                              |
| **Generate Barcode** | Create 1D barcodes — Code128, Code39, EAN-13/8, UPC-A, ISBN-10/13, ISSN, JAN, PZN — as PNG or SVG |

### Security

| Tool                   | Description                                                                                                     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Password Generator** | Generate strong random passwords with configurable length, character types, and entropy display                 |
| **Hash Generator**     | Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text                                                      |
| **File Hash**          | Compute MD5, SHA-1, SHA-256, and SHA-512 hashes of an uploaded file (streamed, no size cap beyond upload limit) |

### Developer Utilities

| Tool                  | Description                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **UUID Generator**    | Generate v4 UUIDs — single or bulk (up to 1000), with uppercase, brace, and no-dash formatting                         |
| **JWT Decoder**       | Decode JSON Web Tokens client-side to inspect header, payload, and claims (decode only — does not verify signatures)   |
| **User-Agent Parser** | Parse browser, OS, device, and engine from any User-Agent string                                                       |
| **SQL Formatter**     | Pretty-print SQL with configurable keyword casing (UPPER / lower / Capitalize) and indentation — powered by `sqlparse` |
| **XML Formatter**     | Format, validate, and minify XML using the browser's native DOMParser                                                  |
| **HTML Formatter**    | Beautify or minify HTML source (void tags, inline tags, and `<script>` / `<style>` content handled correctly)          |
| **CSS Formatter**     | Beautify or minify CSS rules with indent-aware output                                                                  |
| **JS Formatter**      | Basic JavaScript beautifier and minifier (for complex code, use Prettier)                                              |
| **Cron Parser**       | Validate cron expressions, see next upcoming run times, and get a field-by-field breakdown                             |
| **JSONPath Tester**   | Evaluate JSONPath expressions against JSON data — supports extended syntax via `jsonpath-ng`                           |

### Archive Tools

| Tool            | Description                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------- |
| **Create ZIP**  | Bundle multiple files into a single `.zip`, choose Deflate or Store compression                               |
| **Extract ZIP** | Extract the contents of a `.zip` and re-download them (encrypted ZIPs not supported; 500 MB total cap)        |
| **ZIP Info**    | List all entries in a `.zip` with uncompressed/compressed sizes, modified date, and overall compression ratio |

### Audio & Video (requires `ffmpeg` on PATH)

| Tool                  | Description                                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------- |
| **Convert Audio**     | Convert between MP3, WAV, OGG, FLAC, AAC, M4A, and Opus with adjustable bitrate              |
| **Convert Video**     | Convert between MP4, WebM, MKV, MOV, and AVI (uses sensible codec defaults per target)       |
| **Extract Audio**     | Pull the audio track out of a video file to MP3 / WAV / OGG / M4A                            |
| **Trim Media**        | Trim audio or video by start/end time (stream-copy first, re-encodes on keyframe mismatch)   |
| **Compress Video**    | Re-encode video with H.264 at a chosen CRF and preset to shrink file size                    |
| **Video to GIF**      | Convert a clip to an animated GIF with configurable FPS, width, start, and duration          |
| **Convert Subtitles** | Convert between SRT and WebVTT with optional time shift (positive or negative seconds)       |
| **Burn Subtitles**    | Permanently render a `.srt`/`.vtt` into a video (hardsub) with font-size and quality control |
