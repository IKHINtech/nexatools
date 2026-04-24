import type { Dispatch, SetStateAction } from "react";

import logo from "@/assets/images/logo-universal.png";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClipboardSetText } from "../../../../wailsjs/runtime/runtime";
import { navItems } from "../constants";
import type { ActiveGroup, RunState, ToolInfo } from "../types";
import { InfoRow, RulePill, StatusBadge } from "./common";

export function HeaderPanel({ activeTools }: { activeTools: number }) {
  return (
    <header className="grid gap-4 lg:grid-cols-[1.35fr_0.8fr]">
      <Card className="border-stone-300/80 bg-stone-50/85 shadow-[0_30px_90px_-45px_rgba(68,64,60,0.65)] backdrop-blur">
        <CardContent className="px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-3 rounded-full border border-stone-300 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-600">
                <img src={logo} alt="Your Everyday Tools" className="h-7 w-7 rounded-full object-cover ring-1 ring-stone-200" />
                Phase 1 Wails Workbench
              </div>
              <div className="space-y-3">
                <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-[-0.04em] text-stone-900 sm:text-5xl">
                  Backend parity is done. This frontend now exposes the full Phase 1 toolset.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                  UI ini mengikuti roadmap: fokus backend parity dulu, semua action memakai response envelope yang sama,
                  dan flow file-based tetap mengizinkan output path kosong agar backend memakai managed temp workspace.
                </p>
              </div>
            </div>
            <div className="grid gap-3 rounded-[28px] border border-stone-300/80 bg-stone-900 p-5 text-stone-50 shadow-inner">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-stone-400">Manifest</div>
                <div className="mt-2 text-3xl font-black">{activeTools}</div>
                <div className="text-sm text-stone-300">active tools in Phase 1 scope</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/8 p-3">
                  <div className="text-stone-400">Current lane</div>
                  <div className="font-semibold text-white">Lane A</div>
                </div>
                <div className="rounded-2xl bg-white/8 p-3">
                  <div className="text-stone-400">Focus</div>
                  <div className="font-semibold text-white">T1-1 to T1-5</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-stone-300/80 bg-white/75 shadow-[0_20px_70px_-50px_rgba(68,64,60,0.7)] backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-black tracking-[-0.02em] text-stone-900">Rules carried from roadmap</CardTitle>
          <CardDescription className="text-stone-600">
            Frontend parity only. No external binary is needed for these Phase 1 categories.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-stone-700">
          <RulePill label="Unified envelope" value="success / data / error / trace_id" />
          <RulePill label="File outputs" value="empty output path => managed temp workspace" />
          <RulePill label="Verification" value="backend tests already cover Text, Calc, Security, QR, Archive" />
        </CardContent>
      </Card>
    </header>
  );
}

export function Sidebar({
  activeGroup,
  setActiveGroup,
  toolSearch,
  setToolSearch,
  tools,
  filteredTools,
  countsByGroup,
}: {
  activeGroup: ActiveGroup;
  setActiveGroup: Dispatch<SetStateAction<ActiveGroup>>;
  toolSearch: string;
  setToolSearch: Dispatch<SetStateAction<string>>;
  tools: ToolInfo[];
  filteredTools: ToolInfo[];
  countsByGroup: Record<ActiveGroup, { active: number; total: number }>;
}) {
  return (
    <aside className="space-y-4">
      <Card className="border-stone-300/80 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-black tracking-[-0.02em]">Phase 1 Categories</CardTitle>
          <CardDescription>Select a work area. Status comes from `ListTools()`.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeGroup === item.id;
            const counts = countsByGroup[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveGroup(item.id)}
                className={[
                  "group w-full rounded-2xl border px-4 py-4 text-left transition-all",
                  isActive
                    ? `border-stone-900 bg-gradient-to-r ${item.tone} shadow-[0_18px_45px_-32px_rgba(28,25,23,0.85)]`
                    : "border-stone-200 bg-stone-50/70 hover:border-stone-400 hover:bg-white",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-stone-900">{item.label}</span>
                  <Badge variant="outline" className={isActive ? "border-stone-900 bg-stone-900 text-stone-50" : "bg-white"}>
                    {counts.active}/{counts.total}
                  </Badge>
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.16em] text-stone-500 group-hover:text-stone-700">{item.prefix}</div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-stone-300/80 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-black tracking-[-0.02em]">Capability Search</CardTitle>
          <CardDescription>Inspect the live manifest exported by the backend registry.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={toolSearch}
            onChange={(e) => setToolSearch(e.target.value)}
            placeholder="Search text.slug or archive..."
            className="border-stone-300 bg-white"
          />
          <div className="max-h-[360px] space-y-2 overflow-auto pr-1">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="rounded-2xl border border-stone-200 bg-stone-50/80 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate font-medium text-stone-900">{tool.id}</div>
                  <Badge variant={tool.status === "active" ? "success" : "muted"}>{tool.status}</Badge>
                </div>
                <div className="mt-1 text-xs text-stone-500">{tool.category}</div>
              </div>
            ))}
            {filteredTools.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-stone-300 p-4 text-sm text-stone-500">
                No tools match this filter.
              </div>
            ) : null}
          </div>
          <div className="text-xs text-stone-500">{tools.length} tools registered</div>
        </CardContent>
      </Card>
    </aside>
  );
}

export function ResultPanel({
  loadingLabel,
  lastRun,
  resultPreview,
}: {
  loadingLabel: string;
  lastRun: RunState;
  resultPreview: string;
}) {
  return (
    <aside className="space-y-4">
      <Card className="border-stone-300/80 bg-stone-950 text-stone-50 shadow-[0_26px_70px_-45px_rgba(12,10,9,0.95)] xl:sticky xl:top-6">
        <CardHeader>
          <CardTitle className="text-xl font-black tracking-[-0.03em] text-white">Execution Envelope</CardTitle>
          <CardDescription className="text-stone-300">
            {loadingLabel ? `Running ${loadingLabel}...` : `Last action: ${lastRun.title}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.2em] text-stone-400">Status</div>
              <StatusBadge
                loading={loadingLabel !== ""}
                idle={!lastRun.result && loadingLabel === ""}
                success={lastRun.result?.success}
              />
            </div>
            <div className="mt-4 space-y-3">
              <InfoRow label="trace_id" value={lastRun.result?.trace_id ?? "not generated yet"} />
              <InfoRow label="error" value={lastRun.result?.error ? `${lastRun.result.error.code}: ${lastRun.result.error.message}` : "none"} />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#15110c] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.2em] text-stone-400">data preview</div>
              <Button variant="secondary" size="sm" onClick={() => void ClipboardSetText(resultPreview)} className="bg-stone-100 text-stone-900 hover:bg-white">
                Copy
              </Button>
            </div>
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-black/30 p-4 text-xs leading-6 text-stone-100">
              {resultPreview}
            </pre>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-stone-300">
            <div className="font-semibold text-white">Frontend conventions</div>
            <div className="mt-2">File tools accept absolute paths.</div>
            <div>Optional output paths may be left empty to use backend-managed temp storage.</div>
            <div>Result panel shows the raw normalized envelope output, not an inferred summary.</div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
