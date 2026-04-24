import type { CSSProperties, ChangeEvent, DragEvent, ReactNode } from "react";
import { useEffect, useId, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CanResolveFilePaths, OnFileDrop, OnFileDropOff, ResolveFilePaths } from "../../../../wailsjs/runtime/runtime";

const dropRegistry = new Map<string, (paths: string[]) => void>();
let dropListenerActive = false;

function ensureDropListener() {
  if (dropListenerActive) {
    return;
  }
  OnFileDrop((x, y, paths) => {
    const target = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-drop-key]");
    const key = target?.dataset.dropKey;
    if (!key) {
      return;
    }
    const handler = dropRegistry.get(key);
    if (handler) {
      handler(paths);
    }
  }, true);
  dropListenerActive = true;
}

const dropTargetStyle: CSSProperties & { "--wails-drop-target": string } = {
  "--wails-drop-target": "drop",
};

function releaseDropListenerIfNeeded() {
  if (dropRegistry.size === 0 && dropListenerActive) {
    OnFileDropOff();
    dropListenerActive = false;
  }
}

async function resolveSelectedPaths(fileList: FileList): Promise<string[]> {
  const files = Array.from(fileList);
  if (files.length === 0) {
    return [];
  }
  if (CanResolveFilePaths()) {
    ResolveFilePaths(files);
    await new Promise((resolve) => window.setTimeout(resolve, 30));
  }
  return files
    .map((file) => (file as File & { path?: string }).path ?? "")
    .filter(Boolean);
}

export function ToolCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="app-panel shadow-[0_20px_60px_-50px_rgba(0,0,0,0.18)] backdrop-blur">
      <CardHeader>
        <CardTitle className="text-2xl font-black tracking-[-0.03em]">{title}</CardTitle>
        <CardDescription className="app-subtle">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm font-semibold text-[var(--shell-text)]">{label}</Label>
      {children}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="app-elevated flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 text-sm text-[var(--shell-text)] transition hover:border-[var(--shell-border-strong)] hover:bg-[var(--shell-elevated)]">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#1ed760]" />
    </label>
  );
}

export function RulePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="app-elevated rounded-2xl border px-4 py-3">
      <div className="app-subtle text-[11px] font-bold uppercase tracking-[0.18em]">{label}</div>
      <div className="mt-1 text-sm font-medium text-[var(--shell-text)]">{value}</div>
    </div>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="app-subtle text-[11px] uppercase tracking-[0.18em]">{label}</div>
      <div className="mt-1 break-words text-sm text-[var(--shell-text)]">{value}</div>
    </div>
  );
}

export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="app-panel backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl font-black tracking-[-0.03em]">{title}</CardTitle>
        <CardDescription className="app-subtle">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

export function CopyPreviewButton({
  onCopy,
}: {
  onCopy: () => void;
}) {
  return (
    <Button variant="secondary" size="sm" onClick={onCopy} className="bg-[#1ed760] text-[#04130a] hover:bg-[#3be477]">
      Copy
    </Button>
  );
}

export function StatusBadge({ success, idle, loading }: { success?: boolean; idle?: boolean; loading?: boolean }) {
  if (loading) {
    return <Badge variant="muted" className="bg-stone-700 text-stone-200">running</Badge>;
  }
  if (idle) {
    return <Badge variant="muted" className="bg-stone-700 text-stone-200">idle</Badge>;
  }
  return success ? (
    <Badge variant="success" className="bg-emerald-400/15 text-emerald-300 border-emerald-400/20">success</Badge>
  ) : (
    <Badge variant="danger" className="bg-red-400/15 text-red-200 border-red-400/20">error</Badge>
  );
}

export function PathPicker({
  label,
  value,
  placeholder,
  onChange,
  onPick,
  buttonLabel = "Pick file",
  accept,
  multiple,
  directory,
  helper,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  onPick: (paths: string[]) => void;
  buttonLabel?: string;
  accept?: string;
  multiple?: boolean;
  directory?: boolean;
  helper?: string;
}) {
  const inputId = useId();
  const dropKey = useId();
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ensureDropListener();
    dropRegistry.set(dropKey, (paths) => {
      if (paths.length === 0) {
        return;
      }
      onPick(paths);
    });
    return () => {
      dropRegistry.delete(dropKey);
      releaseDropListenerIfNeeded();
    };
  }, [dropKey, onPick]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) {
      return;
    }
    const paths = await resolveSelectedPaths(fileList);
    if (paths.length > 0) {
      onPick(paths);
    }
    event.target.value = "";
  }

  async function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const fileList = event.dataTransfer.files;
    if (fileList.length === 0) {
      return;
    }
    const paths = await resolveSelectedPaths(fileList);
    if (paths.length > 0) {
      onPick(paths);
    }
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={inputId} className="text-sm font-semibold text-[var(--shell-text)]">{label}</Label>
      <div
        data-drop-key={dropKey}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => void handleDrop(event)}
        style={dropTargetStyle}
        className="app-card-soft rounded-3xl border border-dashed p-3 transition hover:border-[#1ed760]/40 hover:bg-[var(--shell-panel)]"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            id={inputId}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="border-[var(--shell-border)] bg-[var(--shell-input)]"
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => hiddenInputRef.current?.click()} className="app-button-outline">
              {buttonLabel}
            </Button>
            {value ? (
              <Button type="button" variant="ghost" onClick={() => onChange("")} className="app-subtle hover:bg-[var(--shell-elevated)] hover:text-[var(--shell-text)]">
                Clear
              </Button>
            ) : null}
          </div>
        </div>
        <div className="app-subtle mt-2 text-xs leading-5">
          {helper ?? "Drop file here or choose from disk. In Wails desktop, picker resolves absolute paths for backend use."}
        </div>
      </div>
      <input
        ref={hiddenInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(event) => void handleFileChange(event)}
        className="hidden"
        {...(directory ? ({ webkitdirectory: "true" } as unknown as Record<string, string>) : {})}
      />
    </div>
  );
}
