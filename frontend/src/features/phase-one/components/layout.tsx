import type { Dispatch, SetStateAction } from "react";
import {
  Archive,
  Calculator,
  QrCode,
  Shield,
  Type,
  ChevronRight,
} from "lucide-react";

import logo from "@/assets/images/logo-universal.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ClipboardSetText } from "../../../../wailsjs/runtime/runtime";
import { navItems } from "../constants";
import type { ActiveGroup, RunState, ToolInfo } from "../types";
import { InfoRow, StatusBadge } from "./common";

const iconMap = {
  text: Type,
  calc: Calculator,
  security: Shield,
  qr: QrCode,
  archive: Archive,
} as const;

export function TopBar({
  toolSearch,
  setToolSearch,
  filteredTools,
  activeTools,
}: {
  toolSearch: string;
  setToolSearch: Dispatch<SetStateAction<string>>;
  filteredTools: ToolInfo[];
  activeTools: number;
}) {
  return (
    <header className="sticky top-0 z-20 rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(30,30,30,0.96),rgba(18,18,18,0.92))] px-5 py-4 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.85)] backdrop-blur xl:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] shadow-[0_10px_30px_-15px_rgba(30,215,96,0.9)]">
            <img src={logo} alt="NexaTools" className="h-7 w-7 rounded-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#b3b3b3]">Desktop Toolkit</div>
            <div className="truncate text-2xl font-black tracking-[-0.03em] text-white">NexaTools</div>
            <div className="text-sm text-[#b3b3b3]">Spotify-inspired shell with unified response envelope and desktop-first flows.</div>
          </div>
        </div>

        <div className="grid gap-3 xl:min-w-[580px] xl:grid-cols-[minmax(0,1fr)_auto]">
          <div className="rounded-full border border-white/8 bg-[#242424] p-1.5">
            <Input
              value={toolSearch}
              onChange={(e) => setToolSearch(e.target.value)}
              placeholder="Search capabilities: text.slug, archive, qr..."
              className="h-11 rounded-full border-0 bg-transparent px-4 text-white placeholder:text-[#b3b3b3] shadow-none focus-visible:ring-2 focus-visible:ring-[#1ed760]/40"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/8 bg-[#242424] px-4 py-2">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#b3b3b3]">Active</div>
              <div className="text-lg font-black text-white">{activeTools}</div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[#242424] px-4 py-2">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#b3b3b3]">Visible</div>
              <div className="text-lg font-black text-white">{filteredTools.length}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Sidebar({
  activeGroup,
  setActiveGroup,
  countsByGroup,
}: {
  activeGroup: ActiveGroup;
  setActiveGroup: Dispatch<SetStateAction<ActiveGroup>>;
  countsByGroup: Record<ActiveGroup, { active: number; total: number }>;
}) {
  return (
    <aside className="space-y-4">
      <Card className="border-white/8 bg-[#181818] text-white shadow-[0_24px_60px_-40px_rgba(0,0,0,0.95)]">
        <CardHeader>
          <CardTitle className="text-lg font-black tracking-[-0.02em] text-white">Features</CardTitle>
          <CardDescription className="text-[#b3b3b3]">Grouped to match `frontend/feature.md` for the currently implemented tools.</CardDescription>
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
                  "group w-full rounded-2xl border px-4 py-4 text-left transition-all duration-300",
                  isActive
                    ? "translate-x-1 border-[#1ed760]/25 bg-[linear-gradient(135deg,rgba(30,215,96,0.18),rgba(30,30,30,0.95))] shadow-[0_18px_45px_-32px_rgba(30,215,96,0.55)]"
                    : "border-white/6 bg-[#121212] hover:-translate-y-0.5 hover:border-white/12 hover:bg-[#1f1f1f]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={["flex h-10 w-10 items-center justify-center rounded-xl border transition-colors", isActive ? "border-[#1ed760]/30 bg-[#1ed760] text-[#04130a]" : "border-white/8 bg-[#242424] text-[#b3b3b3] group-hover:text-white"].join(" ")}>
                      {(() => {
                        const Icon = iconMap[item.id];
                        return <Icon className="h-4 w-4" />;
                      })()}
                    </div>
                    <span className="font-semibold text-white">{item.label}</span>
                  </div>
                  <Badge variant="outline" className={isActive ? "border-[#1ed760]/30 bg-[#1ed760] text-[#04130a]" : "border-white/10 bg-[#242424] text-[#b3b3b3]"}>
                    {counts.active}/{counts.total}
                  </Badge>
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.16em] text-[#b3b3b3] group-hover:text-white">{item.prefix}</div>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </aside>
  );
}

export function CategoryHero({
  activeGroup,
  setActiveGroup,
  countsByGroup,
  title,
  loadingLabel,
}: {
  activeGroup: ActiveGroup;
  setActiveGroup: Dispatch<SetStateAction<ActiveGroup>>;
  countsByGroup: Record<ActiveGroup, { active: number; total: number }>;
  title: string;
  loadingLabel: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#b3b3b3]">
        <span>Browse</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>Features</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-white">{title}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.id];
          const isActive = item.id === activeGroup;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveGroup(item.id)}
              className={[
                "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "border-[#1ed760]/30 bg-[#1ed760] text-[#04130a] shadow-[0_12px_30px_-18px_rgba(30,215,96,0.95)]"
                  : "border-white/8 bg-[#242424] text-[#b3b3b3] hover:-translate-y-0.5 hover:border-white/16 hover:bg-[#2a2a2a] hover:text-white",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              <span className={isActive ? "text-[#0a3018]" : "text-[#8a8a8a]"}>{countsByGroup[item.id].active}</span>
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden border-white/8 bg-[linear-gradient(135deg,rgba(30,215,96,0.22),rgba(30,30,30,0.94)_34%,rgba(18,18,18,0.96)_100%)] shadow-[0_24px_60px_-36px_rgba(0,0,0,0.95)]">
        <CardContent className="px-6 py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b3b3b3]">Current lane</div>
              <div className="text-4xl font-black tracking-[-0.05em] text-white">{title}</div>
              <div className="max-w-2xl text-sm leading-6 text-[#d1d1d1]">
                Frontend parity mengikuti roadmap: semua aksi tetap memakai envelope yang sama, dan kategori ini mempertahankan flow yang aman untuk temp workspace maupun input path manual.
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#b3b3b3]">Active tools</div>
                <div className="mt-1 text-2xl font-black text-white">{countsByGroup[activeGroup].active}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#b3b3b3]">Status</div>
                <div className="mt-1 text-sm font-semibold text-white">{loadingLabel ? `Running ${loadingLabel}` : "Ready to run"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
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
      <Card className="border-white/8 bg-[#181818] text-stone-50 shadow-[0_26px_70px_-45px_rgba(12,10,9,0.95)] xl:sticky xl:top-26">
        <CardHeader>
          <CardTitle className="text-xl font-black tracking-[-0.03em] text-white">Execution Envelope</CardTitle>
          <CardDescription className="text-[#b3b3b3]">
            {loadingLabel ? `Running ${loadingLabel}...` : `Last action: ${lastRun.title}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-[#242424] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.2em] text-[#b3b3b3]">Status</div>
              <StatusBadge loading={loadingLabel !== ""} idle={!lastRun.result && loadingLabel === ""} success={lastRun.result?.success} />
            </div>
            <div className="mt-4 space-y-3">
              <InfoRow label="trace_id" value={lastRun.result?.trace_id ?? "not generated yet"} />
              <InfoRow label="error" value={lastRun.result?.error ? `${lastRun.result.error.code}: ${lastRun.result.error.message}` : "none"} />
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-[#121212] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-[0.2em] text-[#b3b3b3]">data preview</div>
              <Button variant="secondary" size="sm" onClick={() => void ClipboardSetText(resultPreview)} className="bg-[#1ed760] text-[#04130a] hover:bg-[#3be477]">
                Copy
              </Button>
            </div>
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-words rounded-2xl bg-black/30 p-4 text-xs leading-6 text-stone-100">
              {resultPreview}
            </pre>
          </div>

          <div className="rounded-3xl border border-white/8 bg-[#242424] p-4 text-sm leading-6 text-[#b3b3b3]">
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
