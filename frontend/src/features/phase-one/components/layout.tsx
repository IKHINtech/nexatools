import type { Dispatch, SetStateAction } from "react";
import {
  Archive,
  Calculator,
  MoonStar,
  QrCode,
  Shield,
  SunMedium,
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
  theme,
  onToggleTheme,
  toolSearch,
  setToolSearch,
  filteredTools,
  activeTools,
}: {
  theme: "dark" | "light";
  onToggleTheme: () => void;
  toolSearch: string;
  setToolSearch: Dispatch<SetStateAction<string>>;
  filteredTools: ToolInfo[];
  activeTools: number;
}) {
  return (
    <header className="app-topbar sticky top-0 z-20 rounded-[28px] border px-5 py-4 backdrop-blur xl:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] shadow-[0_10px_30px_-15px_rgba(30,215,96,0.9)]">
            <img src={logo} alt="NexaTools" className="h-7 w-7 rounded-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="app-subtle text-[11px] font-bold uppercase tracking-[0.24em]">Desktop Toolkit</div>
            <div className="truncate text-2xl font-black tracking-[-0.03em]">NexaTools</div>
            <div className="app-subtle text-sm">Spotify-inspired shell with unified response envelope and desktop-first flows.</div>
          </div>
        </div>

        <div className="grid gap-3 xl:min-w-[680px] xl:grid-cols-[minmax(0,1fr)_auto_auto]">
          <div className="app-elevated rounded-full border p-1.5">
            <Input
              value={toolSearch}
              onChange={(e) => setToolSearch(e.target.value)}
              placeholder="Search capabilities: text.slug, archive, qr..."
              className="h-11 rounded-full border-0 bg-transparent px-4 shadow-none focus-visible:ring-2"
            />
          </div>
          <Button type="button" variant="outline" onClick={onToggleTheme} className="app-theme-toggle h-full rounded-2xl px-4">
            {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          </Button>
          <div className="flex items-center gap-3">
            <div className="app-elevated rounded-2xl border px-4 py-2">
              <div className="app-subtle text-[11px] uppercase tracking-[0.18em]">Active</div>
              <div className="text-lg font-black">{activeTools}</div>
            </div>
            <div className="app-elevated rounded-2xl border px-4 py-2">
              <div className="app-subtle text-[11px] uppercase tracking-[0.18em]">Visible</div>
              <div className="text-lg font-black">{filteredTools.length}</div>
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
      <Card className="app-panel shadow-[0_24px_60px_-40px_rgba(0,0,0,0.2)]">
        <CardHeader>
          <CardTitle className="text-lg font-black tracking-[-0.02em]">Features</CardTitle>
          <CardDescription className="app-subtle">Grouped to match `frontend/feature.md` for the currently implemented tools.</CardDescription>
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
                    ? "app-nav-active translate-x-1 shadow-[0_18px_45px_-32px_rgba(30,215,96,0.28)]"
                    : "app-card-soft hover:-translate-y-0.5",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={["flex h-10 w-10 items-center justify-center rounded-xl border transition-colors", isActive ? "app-nav-icon-active" : "app-elevated app-subtle group-hover:text-[var(--shell-text)]"].join(" ")}>
                      {(() => {
                        const Icon = iconMap[item.id];
                        return <Icon className="h-4 w-4" />;
                      })()}
                    </div>
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <Badge variant="outline" className={isActive ? "app-nav-badge-active" : "app-badge-muted"}>
                    {counts.active}/{counts.total}
                  </Badge>
                </div>
                <div className="app-subtle mt-2 text-xs uppercase tracking-[0.16em] group-hover:text-[var(--shell-text)]">{item.prefix}</div>
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
      <div className="app-subtle flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
        <span>Browse</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span>Features</span>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[var(--shell-text)]">{title}</span>
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
                  : "app-badge-muted hover:-translate-y-0.5 hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-elevated)] hover:text-[var(--shell-text)]",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              <span className={isActive ? "text-[#0a3018]" : "text-[var(--shell-subtext)]"}>{countsByGroup[item.id].active}</span>
            </button>
          );
        })}
      </div>

      <Card className="app-hero overflow-hidden shadow-[0_24px_60px_-36px_rgba(0,0,0,0.24)]">
        <CardContent className="px-6 py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="app-subtle text-[11px] font-bold uppercase tracking-[0.22em]">Current lane</div>
              <div className="text-4xl font-black tracking-[-0.05em]">{title}</div>
              <div className="max-w-2xl text-sm leading-6 text-[var(--shell-muted-copy)]">
                Frontend parity mengikuti roadmap: semua aksi tetap memakai envelope yang sama, dan kategori ini mempertahankan flow yang aman untuk temp workspace maupun input path manual.
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="app-hero-stat rounded-2xl border px-4 py-3">
                <div className="app-subtle text-[11px] uppercase tracking-[0.18em]">Active tools</div>
                <div className="mt-1 text-2xl font-black">{countsByGroup[activeGroup].active}</div>
              </div>
              <div className="app-hero-stat rounded-2xl border px-4 py-3">
                <div className="app-subtle text-[11px] uppercase tracking-[0.18em]">Status</div>
                <div className="mt-1 text-sm font-semibold">{loadingLabel ? `Running ${loadingLabel}` : "Ready to run"}</div>
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
      <Card className="app-panel xl:sticky xl:top-26">
        <CardHeader>
          <CardTitle className="text-xl font-black tracking-[-0.03em]">Execution Envelope</CardTitle>
          <CardDescription className="app-subtle">
            {loadingLabel ? `Running ${loadingLabel}...` : `Last action: ${lastRun.title}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="app-elevated rounded-3xl border p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="app-subtle text-xs uppercase tracking-[0.2em]">Status</div>
              <StatusBadge loading={loadingLabel !== ""} idle={!lastRun.result && loadingLabel === ""} success={lastRun.result?.success} />
            </div>
            <div className="mt-4 space-y-3">
              <InfoRow label="trace_id" value={lastRun.result?.trace_id ?? "not generated yet"} />
              <InfoRow label="error" value={lastRun.result?.error ? `${lastRun.result.error.code}: ${lastRun.result.error.message}` : "none"} />
            </div>
          </div>

          <div className="app-card-soft rounded-3xl p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="app-subtle text-xs uppercase tracking-[0.2em]">data preview</div>
              <Button variant="secondary" size="sm" onClick={() => void ClipboardSetText(resultPreview)} className="bg-[#1ed760] text-[#04130a] hover:bg-[#3be477]">
                Copy
              </Button>
            </div>
            <pre className="app-code max-h-[420px] overflow-auto whitespace-pre-wrap break-words rounded-2xl p-4 text-xs leading-6">
              {resultPreview}
            </pre>
          </div>

          <div className="app-elevated app-subtle rounded-3xl border p-4 text-sm leading-6">
            <div className="font-semibold text-[var(--shell-text)]">Frontend conventions</div>
            <div className="mt-2">File tools accept absolute paths.</div>
            <div>Optional output paths may be left empty to use backend-managed temp storage.</div>
            <div>Result panel shows the raw normalized envelope output, not an inferred summary.</div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
