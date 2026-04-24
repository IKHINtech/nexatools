import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, ToolCard } from "./common";
import type { TextState, ToolResult, WordStats } from "../types";

type Props = {
  state: TextState;
  setState: Dispatch<SetStateAction<TextState>>;
  loading: boolean;
  runTool: <T>(title: string, fn: () => Promise<ToolResult<T>>) => Promise<void>;
  bindings: {
    formatJSON: (input: string, indent: string) => Promise<ToolResult<string>>;
    minifyJSON: (input: string) => Promise<ToolResult<string>>;
    base64Encode: (input: string) => Promise<ToolResult<string>>;
    base64Decode: (input: string) => Promise<ToolResult<string>>;
    urlEncode: (input: string) => Promise<ToolResult<string>>;
    urlDecode: (input: string) => Promise<ToolResult<string>>;
    wordCount: (input: string) => Promise<ToolResult<WordStats>>;
    convertCase: (input: string, mode: string) => Promise<ToolResult<string>>;
    slug: (input: string) => Promise<ToolResult<string>>;
    lorem: (paragraphs: number, sentences: number, words: number) => Promise<ToolResult<string>>;
    csvToJSON: (input: string) => Promise<ToolResult<string>>;
    jsonToCSV: (input: string) => Promise<ToolResult<string>>;
  };
};

export function TextToolsSection({ state, setState, loading, runTool, bindings }: Props) {
  const { jsonInput, jsonIndent, textInput, caseMode, loremConfig, csvJsonInput } = state;

  return (
    <>
      <ToolCard title="JSON Formatter / Minifier" description="Format or minify JSON without leaving the desktop shell.">
        <div className="grid gap-4">
          <Field label="Input JSON">
            <Textarea value={jsonInput} onChange={(e) => setState((prev) => ({ ...prev, jsonInput: e.target.value }))} rows={7} />
          </Field>
          <Field label="Indent">
            <Input value={jsonIndent} onChange={(e) => setState((prev) => ({ ...prev, jsonIndent: e.target.value }))} />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void runTool("TextFormatJSON", () => bindings.formatJSON(jsonInput, jsonIndent))} disabled={loading}>Format JSON</Button>
            <Button variant="outline" onClick={() => void runTool("TextMinifyJSON", () => bindings.minifyJSON(jsonInput))} disabled={loading}>Minify JSON</Button>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Encoding Bench" description="Base64 and URL helpers share the same text source so the output is easy to compare.">
        <div className="grid gap-4">
          <Field label="Source text">
            <Textarea value={textInput} onChange={(e) => setState((prev) => ({ ...prev, textInput: e.target.value }))} rows={5} />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void runTool("TextBase64Encode", () => bindings.base64Encode(textInput))} disabled={loading}>Base64 Encode</Button>
            <Button variant="outline" onClick={() => void runTool("TextBase64Decode", () => bindings.base64Decode(textInput))} disabled={loading}>Base64 Decode</Button>
            <Button variant="outline" onClick={() => void runTool("TextURLEncode", () => bindings.urlEncode(textInput))} disabled={loading}>URL Encode</Button>
            <Button variant="outline" onClick={() => void runTool("TextURLDecode", () => bindings.urlDecode(textInput))} disabled={loading}>URL Decode</Button>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Word Stats / Case / Slug" description="One text area drives the text analysis and normalization tools.">
        <div className="grid gap-4">
          <Field label="Text input">
            <Textarea value={textInput} onChange={(e) => setState((prev) => ({ ...prev, textInput: e.target.value }))} rows={5} />
          </Field>
          <Field label="Case mode">
            <select value={caseMode} onChange={(e) => setState((prev) => ({ ...prev, caseMode: e.target.value }))} className={selectClass}>
              <option value="upper">upper</option>
              <option value="lower">lower</option>
              <option value="title">title</option>
              <option value="snake">snake</option>
              <option value="kebab">kebab</option>
              <option value="camel">camel</option>
              <option value="pascal">pascal</option>
            </select>
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void runTool("TextWordCount", () => bindings.wordCount(textInput))} disabled={loading}>Count Words</Button>
            <Button variant="outline" onClick={() => void runTool("TextConvertCase", () => bindings.convertCase(textInput, caseMode))} disabled={loading}>Convert Case</Button>
            <Button variant="outline" onClick={() => void runTool("TextSlug", () => bindings.slug(textInput))} disabled={loading}>Make Slug</Button>
          </div>
        </div>
      </ToolCard>

      <ToolCard title="Lorem Generator / CSV ↔ JSON" description="Quick structured data helpers for mock payloads and lightweight data transforms.">
        <div className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Paragraphs">
              <Input value={loremConfig.paragraphs} onChange={(e) => setState((prev) => ({ ...prev, loremConfig: { ...prev.loremConfig, paragraphs: Number(e.target.value) || 0 } }))} />
            </Field>
            <Field label="Sentences / paragraph">
              <Input value={loremConfig.sentences} onChange={(e) => setState((prev) => ({ ...prev, loremConfig: { ...prev.loremConfig, sentences: Number(e.target.value) || 0 } }))} />
            </Field>
            <Field label="Words / sentence">
              <Input value={loremConfig.words} onChange={(e) => setState((prev) => ({ ...prev, loremConfig: { ...prev.loremConfig, words: Number(e.target.value) || 0 } }))} />
            </Field>
          </div>
          <Button onClick={() => void runTool("TextLorem", () => bindings.lorem(loremConfig.paragraphs, loremConfig.sentences, loremConfig.words))} disabled={loading}>
            Generate Lorem
          </Button>
          <Field label="CSV or JSON input">
            <Textarea value={csvJsonInput} onChange={(e) => setState((prev) => ({ ...prev, csvJsonInput: e.target.value }))} rows={7} />
          </Field>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => void runTool("TextCSVToJSON", () => bindings.csvToJSON(csvJsonInput))} disabled={loading}>CSV to JSON</Button>
            <Button variant="outline" onClick={() => void runTool("TextJSONToCSV", () => bindings.jsonToCSV(csvJsonInput))} disabled={loading}>JSON to CSV</Button>
          </div>
        </div>
      </ToolCard>
    </>
  );
}

const selectClass =
  "h-11 w-full appearance-none rounded-2xl border border-white/10 bg-[#242424] px-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition [color-scheme:dark] focus:border-[#1ed760]/70 focus:ring-4 focus:ring-[#1ed760]/20";
