import { useDeferredValue, useEffect, useMemo, useState } from "react";

import {
  ArchiveCreateZIP,
  ArchiveExtractZIP,
  ArchiveZIPInfo,
  CalcAddDays,
  CalcBasic,
  CalcDateDiff,
  CalcISOToTimestamp,
  CalcNumberBase,
  CalcPercentage,
  CalcTimestampToISO,
  CalcUnit,
  ListTools,
  QRGenerateBarcodeSVG,
  QRGeneratePNG,
  QRReadFromImage,
  SecurityHashFile,
  SecurityHashText,
  SecurityPassword,
  TextBase64Decode,
  TextBase64Encode,
  TextCSVToJSON,
  TextConvertCase,
  TextFormatJSON,
  TextJSONToCSV,
  TextLorem,
  TextMinifyJSON,
  TextSlug,
  TextURLDecode,
  TextURLEncode,
  TextWordCount,
} from "../wailsjs/go/bindings/App";
import "@/index.css";
import { ArchiveToolsSection } from "@/features/phase-one/components/archive-tools";
import { CalcToolsSection } from "@/features/phase-one/components/calc-tools";
import { CategoryHero, ResultPanel, Sidebar, TopBar } from "@/features/phase-one/components/layout";
import { QRToolsSection } from "@/features/phase-one/components/qr-tools";
import { SecurityToolsSection } from "@/features/phase-one/components/security-tools";
import { TextToolsSection } from "@/features/phase-one/components/text-tools";
import { navItems } from "@/features/phase-one/constants";
import type {
  ActiveGroup,
  ArchiveState,
  CalcState,
  QRState,
  RunState,
  SecurityState,
  TextState,
  ToolInfo,
  ToolResult,
  WordStats,
  ZIPEntry,
} from "@/features/phase-one/types";
import { formatResultData } from "@/features/phase-one/utils";

function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") {
      return "dark";
    }
    const stored = window.localStorage.getItem("nexatools-theme");
    return stored === "light" ? "light" : "dark";
  });
  const [activeGroup, setActiveGroup] = useState<ActiveGroup>("text");
  const [loadingLabel, setLoadingLabel] = useState("");
  const [lastRun, setLastRun] = useState<RunState>({
    title: "Ready",
    result: null,
  });
  const [tools, setTools] = useState<ToolInfo[]>([]);
  const [toolSearch, setToolSearch] = useState("");
  const deferredToolSearch = useDeferredValue(toolSearch);

  const [textState, setTextState] = useState<TextState>({
    jsonInput: '{"name":"your tools","category":"text-data"}',
    jsonIndent: "  ",
    textInput: "hello world",
    caseMode: "snake",
    loremConfig: { paragraphs: 2, sentences: 3, words: 8 },
    csvJsonInput: "name,age\nana,20\nbudi,30",
  });

  const [calcState, setCalcState] = useState<CalcState>({
    basicCalc: { op: "add", x: "12", y: "8" },
    unitCalc: { category: "length", value: "1500", from: "m", to: "km" },
    percentageCalc: { mode: "x_is_what_percent_of_y", x: "25", y: "200" },
    dateCalc: {
      start: "2026-01-01",
      end: "2026-01-11",
      date: "2026-01-01",
      days: "30",
      timestamp: "1713916800",
      iso: "2026-01-01T00:00:00Z",
      baseInput: "ff",
      fromBase: "16",
      toBase: "2",
    },
  });

  const [securityState, setSecurityState] = useState<SecurityState>({
    passwordConfig: {
      length: "16",
      lower: true,
      upper: true,
      digits: true,
      symbols: false,
    },
    hashTextState: { algorithm: "sha256", input: "hello" },
    hashFileState: { algorithm: "sha256", path: "" },
  });

  const [qrState, setQRState] = useState<QRState>({
    qrState: {
      content: "https://nexatools.com",
      size: "256",
      outputPath: "",
      inputPath: "",
    },
    barcodeState: {
      format: "code39",
      content: "ABC-123",
      outputPath: "",
    },
  });

  const [archiveState, setArchiveState] = useState<ArchiveState>({
    archiveCreateState: {
      outputPath: "",
      inputPaths: "",
    },
    archiveExtractState: {
      zipPath: "",
      outputDir: "",
    },
    archiveInfoPath: "",
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("nexatools-theme", theme);
  }, [theme]);

  useEffect(() => {
    let mounted = true;

    async function loadTools() {
      const result = (await ListTools()) as ToolResult<ToolInfo[]>;
      if (!mounted) {
        return;
      }
      setTools(result.data ?? []);
      if (!result.success) {
        setLastRun({
          title: "Capability manifest",
          result: result as ToolResult<unknown>,
        });
      }
    }

    void loadTools();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredTools = useMemo(() => {
    const query = deferredToolSearch.trim().toLowerCase();
    if (!query) {
      return tools;
    }
    return tools.filter((tool) => {
      return (
        tool.id.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query) ||
        tool.status.toLowerCase().includes(query)
      );
    });
  }, [deferredToolSearch, tools]);

  const countsByGroup = useMemo(() => {
    return navItems.reduce<Record<ActiveGroup, { active: number; total: number }>>(
      (acc, item) => {
        const matches = tools.filter((tool) => tool.id.startsWith(item.prefix));
        acc[item.id] = {
          active: matches.filter((tool) => tool.status === "active").length,
          total: matches.length,
        };
        return acc;
      },
      {
        text: { active: 0, total: 0 },
        calc: { active: 0, total: 0 },
        security: { active: 0, total: 0 },
        qr: { active: 0, total: 0 },
        archive: { active: 0, total: 0 },
      },
    );
  }, [tools]);

  async function runTool<T>(title: string, fn: () => Promise<ToolResult<T>>) {
    setLoadingLabel(title);
    try {
      const result = await fn();
      setLastRun({
        title,
        result: result as ToolResult<unknown>,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown frontend error";
      setLastRun({
        title,
        result: {
          success: false,
          error: { code: "FRONTEND_ERROR", message },
          trace_id: "frontend",
        },
      });
    } finally {
      setLoadingLabel("");
    }
  }

  const resultPreview = useMemo(() => {
    if (!lastRun.result) {
      return "Choose a tool, execute it, and the normalized response envelope will appear here.";
    }
    return formatResultData(lastRun.result.data);
  }, [lastRun.result]);

  const currentCount = countsByGroup[activeGroup];
  const currentLabel = navItems.find((item) => item.id === activeGroup)?.label ?? "";

  return (
    <div className="app-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1500px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <TopBar
          theme={theme}
          onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          toolSearch={toolSearch}
          setToolSearch={setToolSearch}
          filteredTools={filteredTools}
          activeTools={tools.filter((tool) => tool.status === "active").length}
        />

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_360px]">
          <Sidebar
            activeGroup={activeGroup}
            setActiveGroup={setActiveGroup}
            countsByGroup={countsByGroup}
          />

          <main className="space-y-4">
            <CategoryHero
              activeGroup={activeGroup}
              setActiveGroup={setActiveGroup}
              countsByGroup={countsByGroup}
              title={currentLabel}
              loadingLabel={loadingLabel}
            />

            {activeGroup === "text" ? (
              <TextToolsSection
                state={textState}
                setState={setTextState}
                loading={loadingLabel !== ""}
                runTool={runTool}
                bindings={{
                  formatJSON: (input, indent) => TextFormatJSON(input, indent) as Promise<ToolResult<string>>,
                  minifyJSON: (input) => TextMinifyJSON(input) as Promise<ToolResult<string>>,
                  base64Encode: (input) => TextBase64Encode(input) as Promise<ToolResult<string>>,
                  base64Decode: (input) => TextBase64Decode(input) as Promise<ToolResult<string>>,
                  urlEncode: (input) => TextURLEncode(input) as Promise<ToolResult<string>>,
                  urlDecode: (input) => TextURLDecode(input) as Promise<ToolResult<string>>,
                  wordCount: (input) => TextWordCount(input) as Promise<ToolResult<WordStats>>,
                  convertCase: (input, mode) => TextConvertCase(input, mode) as Promise<ToolResult<string>>,
                  slug: (input) => TextSlug(input) as Promise<ToolResult<string>>,
                  lorem: (paragraphs, sentences, words) => TextLorem(paragraphs, sentences, words) as Promise<ToolResult<string>>,
                  csvToJSON: (input) => TextCSVToJSON(input) as Promise<ToolResult<string>>,
                  jsonToCSV: (input) => TextJSONToCSV(input) as Promise<ToolResult<string>>,
                }}
              />
            ) : null}

            {activeGroup === "calc" ? (
              <CalcToolsSection
                state={calcState}
                setState={setCalcState}
                loading={loadingLabel !== ""}
                runTool={runTool}
                bindings={{
                  calcBasic: (op, x, y) => CalcBasic(op, x, y) as Promise<ToolResult<number>>,
                  calcUnit: (category, value, from, to) => CalcUnit(category, value, from, to) as Promise<ToolResult<number>>,
                  calcPercentage: (mode, x, y) => CalcPercentage(mode, x, y) as Promise<ToolResult<number>>,
                  calcDateDiff: (start, end) => CalcDateDiff(start, end) as Promise<ToolResult<number>>,
                  calcAddDays: (date, days) => CalcAddDays(date, days) as Promise<ToolResult<string>>,
                  calcTimestampToISO: (timestamp) => CalcTimestampToISO(timestamp) as Promise<ToolResult<string>>,
                  calcISOToTimestamp: (iso) => CalcISOToTimestamp(iso) as Promise<ToolResult<number>>,
                  calcNumberBase: (input, fromBase, toBase) => CalcNumberBase(input, fromBase, toBase) as Promise<ToolResult<string>>,
                }}
              />
            ) : null}

            {activeGroup === "security" ? (
              <SecurityToolsSection
                state={securityState}
                setState={setSecurityState}
                loading={loadingLabel !== ""}
                runTool={runTool}
                bindings={{
                  password: (length, lower, upper, digits, symbols) =>
                    SecurityPassword(length, lower, upper, digits, symbols) as Promise<ToolResult<string>>,
                  hashText: (algorithm, input) => SecurityHashText(algorithm, input) as Promise<ToolResult<string>>,
                  hashFile: (algorithm, path) => SecurityHashFile(algorithm, path) as Promise<ToolResult<string>>,
                }}
              />
            ) : null}

            {activeGroup === "qr" ? (
              <QRToolsSection
                state={qrState}
                setState={setQRState}
                loading={loadingLabel !== ""}
                runTool={runTool}
                bindings={{
                  qrGeneratePNG: (content, size, outputPath) => QRGeneratePNG(content, size, outputPath) as Promise<ToolResult<string>>,
                  qrReadFromImage: (path) => QRReadFromImage(path) as Promise<ToolResult<string>>,
                  qrGenerateBarcodeSVG: (format, content, outputPath) =>
                    QRGenerateBarcodeSVG(format, content, outputPath) as Promise<ToolResult<string>>,
                }}
              />
            ) : null}

            {activeGroup === "archive" ? (
              <ArchiveToolsSection
                state={archiveState}
                setState={setArchiveState}
                loading={loadingLabel !== ""}
                runTool={runTool}
                bindings={{
                  archiveCreateZIP: (outputPath, inputPaths) => ArchiveCreateZIP(outputPath, inputPaths) as Promise<ToolResult<string>>,
                  archiveExtractZIP: (zipPath, outputDir) => ArchiveExtractZIP(zipPath, outputDir) as Promise<ToolResult<string>>,
                  archiveZIPInfo: (zipPath) => ArchiveZIPInfo(zipPath) as Promise<ToolResult<ZIPEntry[]>>,
                }}
              />
            ) : null}
          </main>

          <ResultPanel loadingLabel={loadingLabel} lastRun={lastRun} resultPreview={resultPreview} />
        </div>
      </div>
    </div>
  );
}

export default App;
