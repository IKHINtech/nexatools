import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { splitLines } from "../utils";
import { Field, PathPicker, ToolCard } from "./common";
import type { ArchiveState, ToolResult, ZIPEntry } from "../types";

type Props = {
  state: ArchiveState;
  setState: Dispatch<SetStateAction<ArchiveState>>;
  loading: boolean;
  runTool: <T>(title: string, fn: () => Promise<ToolResult<T>>) => Promise<void>;
  bindings: {
    archiveCreateZIP: (outputPath: string, inputPaths: string[]) => Promise<ToolResult<string>>;
    archiveExtractZIP: (zipPath: string, outputDir: string) => Promise<ToolResult<string>>;
    archiveZIPInfo: (zipPath: string) => Promise<ToolResult<ZIPEntry[]>>;
  };
};

export function ArchiveToolsSection({ state, setState, loading, runTool, bindings }: Props) {
  const { archiveCreateState, archiveExtractState, archiveInfoPath } = state;

  return (
    <>
      <ToolCard title="Create ZIP" description="Put one input path per line. Directories preserve internal structure inside the archive.">
        <div className="grid gap-4">
          <Field label="Input paths">
            <Textarea value={archiveCreateState.inputPaths} onChange={(e) => setState((prev) => ({ ...prev, archiveCreateState: { ...prev.archiveCreateState, inputPaths: e.target.value } }))} rows={6} placeholder={"/tmp/file-a.txt\n/tmp/folder-b"} className="border-stone-300 bg-white" />
          </Field>
          <PathPicker
            label="Add files from disk"
            value=""
            placeholder="Use picker or drag-drop to append paths"
            onChange={() => {}}
            onPick={(paths) =>
              setState((prev) => ({
                ...prev,
                archiveCreateState: {
                  ...prev.archiveCreateState,
                  inputPaths: [...splitLines(prev.archiveCreateState.inputPaths), ...paths].join("\n"),
                },
              }))
            }
            buttonLabel="Pick files"
            multiple
            helper="Drop one or more files here to append absolute paths. Folder drops also work in Wails drag-drop."
          />
          <Field label="Output path (optional)">
            <Input value={archiveCreateState.outputPath} onChange={(e) => setState((prev) => ({ ...prev, archiveCreateState: { ...prev.archiveCreateState, outputPath: e.target.value } }))} placeholder="/tmp/output.zip or leave empty" className="border-stone-300 bg-white" />
          </Field>
          <Button onClick={() => void runTool("ArchiveCreateZIP", () => bindings.archiveCreateZIP(archiveCreateState.outputPath, splitLines(archiveCreateState.inputPaths)))} disabled={loading}>Create ZIP</Button>
        </div>
      </ToolCard>

      <ToolCard title="Extract ZIP / ZIP Info" description="Extraction destination can be empty to let backend create a temporary managed directory.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-4">
            <PathPicker
              label="ZIP path"
              value={archiveExtractState.zipPath}
              placeholder="/tmp/archive.zip"
              onChange={(value) => setState((prev) => ({ ...prev, archiveExtractState: { ...prev.archiveExtractState, zipPath: value } }))}
              onPick={(paths) => setState((prev) => ({ ...prev, archiveExtractState: { ...prev.archiveExtractState, zipPath: paths[0] ?? "" } }))}
              buttonLabel="Pick ZIP"
              helper="Drop a ZIP file here or pick one from disk."
            />
            <Field label="Destination dir (optional)">
              <Input value={archiveExtractState.outputDir} onChange={(e) => setState((prev) => ({ ...prev, archiveExtractState: { ...prev.archiveExtractState, outputDir: e.target.value } }))} placeholder="/tmp/unpacked or leave empty" className="border-stone-300 bg-white" />
            </Field>
            <Button variant="outline" onClick={() => void runTool("ArchiveExtractZIP", () => bindings.archiveExtractZIP(archiveExtractState.zipPath, archiveExtractState.outputDir))} disabled={loading}>Extract ZIP</Button>
          </div>
          <div className="grid gap-4">
            <PathPicker
              label="ZIP path"
              value={archiveInfoPath}
              placeholder="/tmp/archive.zip"
              onChange={(value) => setState((prev) => ({ ...prev, archiveInfoPath: value }))}
              onPick={(paths) => setState((prev) => ({ ...prev, archiveInfoPath: paths[0] ?? "" }))}
              buttonLabel="Pick ZIP"
              helper="Drop a ZIP file here or pick one from disk."
            />
            <Button variant="outline" onClick={() => void runTool("ArchiveZIPInfo", () => bindings.archiveZIPInfo(archiveInfoPath))} disabled={loading}>Read ZIP Info</Button>
          </div>
        </div>
      </ToolCard>
    </>
  );
}
