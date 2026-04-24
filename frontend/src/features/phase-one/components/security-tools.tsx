import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, PathPicker, Toggle, ToolCard } from "./common";
import type { SecurityState, ToolResult } from "../types";

type Props = {
  state: SecurityState;
  setState: Dispatch<SetStateAction<SecurityState>>;
  loading: boolean;
  runTool: <T>(title: string, fn: () => Promise<ToolResult<T>>) => Promise<void>;
  bindings: {
    password: (length: number, lower: boolean, upper: boolean, digits: boolean, symbols: boolean) => Promise<ToolResult<string>>;
    hashText: (algorithm: string, input: string) => Promise<ToolResult<string>>;
    hashFile: (algorithm: string, path: string) => Promise<ToolResult<string>>;
  };
};

export function SecurityToolsSection({ state, setState, loading, runTool, bindings }: Props) {
  const { passwordConfig, hashTextState, hashFileState } = state;

  return (
    <>
      <ToolCard title="Password Generator" description="Password generation now guarantees at least one character from each enabled class.">
        <div className="grid gap-4">
          <Field label="Length">
            <Input value={passwordConfig.length} onChange={(e) => setState((prev) => ({ ...prev, passwordConfig: { ...prev.passwordConfig, length: e.target.value } }))} className="border-stone-300 bg-white max-w-xs" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Toggle checked={passwordConfig.lower} onChange={(checked) => setState((prev) => ({ ...prev, passwordConfig: { ...prev.passwordConfig, lower: checked } }))} label="Lowercase" />
            <Toggle checked={passwordConfig.upper} onChange={(checked) => setState((prev) => ({ ...prev, passwordConfig: { ...prev.passwordConfig, upper: checked } }))} label="Uppercase" />
            <Toggle checked={passwordConfig.digits} onChange={(checked) => setState((prev) => ({ ...prev, passwordConfig: { ...prev.passwordConfig, digits: checked } }))} label="Digits" />
            <Toggle checked={passwordConfig.symbols} onChange={(checked) => setState((prev) => ({ ...prev, passwordConfig: { ...prev.passwordConfig, symbols: checked } }))} label="Symbols" />
          </div>
          <Button onClick={() => void runTool("SecurityPassword", () => bindings.password(Number(passwordConfig.length), passwordConfig.lower, passwordConfig.upper, passwordConfig.digits, passwordConfig.symbols))} disabled={loading}>Generate Password</Button>
        </div>
      </ToolCard>

      <ToolCard title="Hash Text / File" description="All hashing paths use the same backend envelope and support MD5, SHA1, SHA256, and SHA512.">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-4">
            <Field label="Algorithm">
              <select value={hashTextState.algorithm} onChange={(e) => setState((prev) => ({ ...prev, hashTextState: { ...prev.hashTextState, algorithm: e.target.value } }))} className={selectClass}>
                <option value="md5">md5</option>
                <option value="sha1">sha1</option>
                <option value="sha256">sha256</option>
                <option value="sha512">sha512</option>
              </select>
            </Field>
            <Field label="Text input">
              <Textarea value={hashTextState.input} onChange={(e) => setState((prev) => ({ ...prev, hashTextState: { ...prev.hashTextState, input: e.target.value } }))} rows={5} className="border-stone-300 bg-white" />
            </Field>
            <Button variant="outline" onClick={() => void runTool("SecurityHashText", () => bindings.hashText(hashTextState.algorithm, hashTextState.input))} disabled={loading}>Hash Text</Button>
          </div>
          <div className="grid gap-4">
            <Field label="Algorithm">
              <select value={hashFileState.algorithm} onChange={(e) => setState((prev) => ({ ...prev, hashFileState: { ...prev.hashFileState, algorithm: e.target.value } }))} className={selectClass}>
                <option value="md5">md5</option>
                <option value="sha1">sha1</option>
                <option value="sha256">sha256</option>
                <option value="sha512">sha512</option>
              </select>
            </Field>
            <PathPicker
              label="Absolute file path"
              value={hashFileState.path}
              placeholder="/tmp/sample.txt"
              onChange={(value) => setState((prev) => ({ ...prev, hashFileState: { ...prev.hashFileState, path: value } }))}
              onPick={(paths) => setState((prev) => ({ ...prev, hashFileState: { ...prev.hashFileState, path: paths[0] ?? "" } }))}
              buttonLabel="Pick file"
              helper="Drop a file here or pick one from disk. The backend expects an absolute path."
            />
            <Button variant="outline" onClick={() => void runTool("SecurityHashFile", () => bindings.hashFile(hashFileState.algorithm, hashFileState.path))} disabled={loading}>Hash File</Button>
          </div>
        </div>
      </ToolCard>
    </>
  );
}

const selectClass =
  "h-11 w-full rounded-2xl border border-stone-300 bg-white px-3 text-sm text-stone-900 shadow-sm outline-none transition focus:border-stone-500 focus:ring-4 focus:ring-stone-200";
