import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PathPicker, ToolCard } from "./common";
import type { QRState, ToolResult } from "../types";

type Props = {
  state: QRState;
  setState: Dispatch<SetStateAction<QRState>>;
  loading: boolean;
  runTool: <T>(title: string, fn: () => Promise<ToolResult<T>>) => Promise<void>;
  bindings: {
    qrGeneratePNG: (content: string, size: number, outputPath: string) => Promise<ToolResult<string>>;
    qrReadFromImage: (path: string) => Promise<ToolResult<string>>;
    qrGenerateBarcodeSVG: (format: string, content: string, outputPath: string) => Promise<ToolResult<string>>;
  };
};

export function QRToolsSection({ state, setState, loading, runTool, bindings }: Props) {
  const { qrState, barcodeState } = state;

  return (
    <>
      <ToolCard title="QR Generator / Reader" description="PNG output path may be left empty to let the backend allocate a temp workspace safely.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-4">
            <Field label="Content">
              <Textarea value={qrState.content} onChange={(e) => setState((prev) => ({ ...prev, qrState: { ...prev.qrState, content: e.target.value } }))} rows={5} />
            </Field>
            <Field label="Size">
              <Input value={qrState.size} onChange={(e) => setState((prev) => ({ ...prev, qrState: { ...prev.qrState, size: e.target.value } }))} />
            </Field>
            <Field label="Output path (optional)">
              <Input value={qrState.outputPath} onChange={(e) => setState((prev) => ({ ...prev, qrState: { ...prev.qrState, outputPath: e.target.value } }))} placeholder="/tmp/qr.png or leave empty" />
            </Field>
            <Button onClick={() => void runTool("QRGeneratePNG", () => bindings.qrGeneratePNG(qrState.content, Number(qrState.size), qrState.outputPath))} disabled={loading}>Generate QR PNG</Button>
          </div>
          <div className="grid gap-4">
            <PathPicker
              label="Image path"
              value={qrState.inputPath}
              placeholder="/tmp/qr.png"
              onChange={(value) => setState((prev) => ({ ...prev, qrState: { ...prev.qrState, inputPath: value } }))}
              onPick={(paths) => setState((prev) => ({ ...prev, qrState: { ...prev.qrState, inputPath: paths[0] ?? "" } }))}
              buttonLabel="Pick image"
              helper="Drop a QR image here or pick one from disk."
            />
            <Button variant="outline" onClick={() => void runTool("QRReadFromImage", () => bindings.qrReadFromImage(qrState.inputPath))} disabled={loading}>Read QR from Image</Button>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Barcode Generator" description="Current barcode scope exposes SVG outputs for Code39 and EAN13.">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Format">
            <select value={barcodeState.format} onChange={(e) => setState((prev) => ({ ...prev, barcodeState: { ...prev.barcodeState, format: e.target.value } }))} className={selectClass}>
              <option value="code39">code39</option>
              <option value="ean13">ean13</option>
            </select>
          </Field>
          <Field label="Content">
            <Input value={barcodeState.content} onChange={(e) => setState((prev) => ({ ...prev, barcodeState: { ...prev.barcodeState, content: e.target.value } }))} />
          </Field>
          <Field label="Output path (optional)">
            <Input value={barcodeState.outputPath} onChange={(e) => setState((prev) => ({ ...prev, barcodeState: { ...prev.barcodeState, outputPath: e.target.value } }))} placeholder="/tmp/barcode.svg or leave empty" />
          </Field>
        </div>
        <Button onClick={() => void runTool("QRGenerateBarcodeSVG", () => bindings.qrGenerateBarcodeSVG(barcodeState.format, barcodeState.content, barcodeState.outputPath))} disabled={loading}>Generate Barcode SVG</Button>
      </ToolCard>
    </>
  );
}

const selectClass =
  "h-11 w-full appearance-none rounded-2xl border border-white/10 bg-[#242424] px-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition [color-scheme:dark] focus:border-[#1ed760]/70 focus:ring-4 focus:ring-[#1ed760]/20";
