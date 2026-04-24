import type { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, ToolCard } from "./common";
import type { CalcState, ToolResult } from "../types";

type Props = {
  state: CalcState;
  setState: Dispatch<SetStateAction<CalcState>>;
  loading: boolean;
  runTool: <T>(title: string, fn: () => Promise<ToolResult<T>>) => Promise<void>;
  bindings: {
    calcBasic: (op: string, x: number, y: number) => Promise<ToolResult<number>>;
    calcUnit: (category: string, value: number, from: string, to: string) => Promise<ToolResult<number>>;
    calcPercentage: (mode: string, x: number, y: number) => Promise<ToolResult<number>>;
    calcDateDiff: (start: string, end: string) => Promise<ToolResult<number>>;
    calcAddDays: (date: string, days: number) => Promise<ToolResult<string>>;
    calcTimestampToISO: (timestamp: number) => Promise<ToolResult<string>>;
    calcISOToTimestamp: (iso: string) => Promise<ToolResult<number>>;
    calcNumberBase: (input: string, fromBase: number, toBase: number) => Promise<ToolResult<string>>;
  };
};

export function CalcToolsSection({ state, setState, loading, runTool, bindings }: Props) {
  const { basicCalc, unitCalc, percentageCalc, dateCalc } = state;

  return (
    <>
      <ToolCard title="Basic Calculator" description="Add, subtract, multiply, divide, and exponentiate numeric values.">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
          <Field label="X"><Input value={basicCalc.x} onChange={(e) => setState((prev) => ({ ...prev, basicCalc: { ...prev.basicCalc, x: e.target.value } }))} /></Field>
          <Field label="Operator">
            <select value={basicCalc.op} onChange={(e) => setState((prev) => ({ ...prev, basicCalc: { ...prev.basicCalc, op: e.target.value } }))} className={selectClass}>
              <option value="add">add</option>
              <option value="sub">sub</option>
              <option value="mul">mul</option>
              <option value="div">div</option>
              <option value="pow">pow</option>
            </select>
          </Field>
          <Field label="Y"><Input value={basicCalc.y} onChange={(e) => setState((prev) => ({ ...prev, basicCalc: { ...prev.basicCalc, y: e.target.value } }))} /></Field>
          <div className="flex items-end"><Button onClick={() => void runTool("CalcBasic", () => bindings.calcBasic(basicCalc.op, Number(basicCalc.x), Number(basicCalc.y)))} disabled={loading}>Run</Button></div>
        </div>
      </ToolCard>

      <ToolCard title="Unit Converter" description="Length, weight, and temperature all route through the same backend converter.">
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="Category">
            <select value={unitCalc.category} onChange={(e) => setState((prev) => ({ ...prev, unitCalc: { ...prev.unitCalc, category: e.target.value } }))} className={selectClass}>
              <option value="length">length</option>
              <option value="weight">weight</option>
              <option value="temperature">temperature</option>
            </select>
          </Field>
          <Field label="Value"><Input value={unitCalc.value} onChange={(e) => setState((prev) => ({ ...prev, unitCalc: { ...prev.unitCalc, value: e.target.value } }))} /></Field>
          <Field label="From"><Input value={unitCalc.from} onChange={(e) => setState((prev) => ({ ...prev, unitCalc: { ...prev.unitCalc, from: e.target.value } }))} /></Field>
          <Field label="To"><Input value={unitCalc.to} onChange={(e) => setState((prev) => ({ ...prev, unitCalc: { ...prev.unitCalc, to: e.target.value } }))} /></Field>
        </div>
        <Button onClick={() => void runTool("CalcUnit", () => bindings.calcUnit(unitCalc.category, Number(unitCalc.value), unitCalc.from, unitCalc.to))} disabled={loading}>Convert Unit</Button>
      </ToolCard>

      <ToolCard title="Percentage / Date / Timestamp / Base" description="Grouped because these are small calculators with distinct output types.">
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Percentage mode">
              <select value={percentageCalc.mode} onChange={(e) => setState((prev) => ({ ...prev, percentageCalc: { ...prev.percentageCalc, mode: e.target.value } }))} className={selectClass}>
                <option value="x_percent_of_y">x_percent_of_y</option>
                <option value="x_is_what_percent_of_y">x_is_what_percent_of_y</option>
                <option value="percent_change">percent_change</option>
              </select>
            </Field>
            <Field label="X"><Input value={percentageCalc.x} onChange={(e) => setState((prev) => ({ ...prev, percentageCalc: { ...prev.percentageCalc, x: e.target.value } }))} /></Field>
            <Field label="Y"><Input value={percentageCalc.y} onChange={(e) => setState((prev) => ({ ...prev, percentageCalc: { ...prev.percentageCalc, y: e.target.value } }))} /></Field>
            <div className="flex items-end"><Button variant="outline" onClick={() => void runTool("CalcPercentage", () => bindings.calcPercentage(percentageCalc.mode, Number(percentageCalc.x), Number(percentageCalc.y)))} disabled={loading}>Run %</Button></div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Start date"><Input value={dateCalc.start} onChange={(e) => setState((prev) => ({ ...prev, dateCalc: { ...prev.dateCalc, start: e.target.value } }))} /></Field>
            <Field label="End date"><Input value={dateCalc.end} onChange={(e) => setState((prev) => ({ ...prev, dateCalc: { ...prev.dateCalc, end: e.target.value } }))} /></Field>
            <Field label="Date"><Input value={dateCalc.date} onChange={(e) => setState((prev) => ({ ...prev, dateCalc: { ...prev.dateCalc, date: e.target.value } }))} /></Field>
            <Field label="Days"><Input value={dateCalc.days} onChange={(e) => setState((prev) => ({ ...prev, dateCalc: { ...prev.dateCalc, days: e.target.value } }))} /></Field>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => void runTool("CalcDateDiff", () => bindings.calcDateDiff(dateCalc.start, dateCalc.end))} disabled={loading}>Date Diff</Button>
            <Button variant="outline" onClick={() => void runTool("CalcAddDays", () => bindings.calcAddDays(dateCalc.date, Number(dateCalc.days)))} disabled={loading}>Add Days</Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Unix timestamp"><Input value={dateCalc.timestamp} onChange={(e) => setState((prev) => ({ ...prev, dateCalc: { ...prev.dateCalc, timestamp: e.target.value } }))} /></Field>
            <Field label="ISO datetime"><Input value={dateCalc.iso} onChange={(e) => setState((prev) => ({ ...prev, dateCalc: { ...prev.dateCalc, iso: e.target.value } }))} /></Field>
            <div className="flex items-end gap-3">
              <Button variant="outline" onClick={() => void runTool("CalcTimestampToISO", () => bindings.calcTimestampToISO(Number(dateCalc.timestamp)))} disabled={loading}>Timestamp → ISO</Button>
              <Button variant="outline" onClick={() => void runTool("CalcISOToTimestamp", () => bindings.calcISOToTimestamp(dateCalc.iso))} disabled={loading}>ISO → Timestamp</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Number"><Input value={dateCalc.baseInput} onChange={(e) => setState((prev) => ({ ...prev, dateCalc: { ...prev.dateCalc, baseInput: e.target.value } }))} /></Field>
            <Field label="From base"><Input value={dateCalc.fromBase} onChange={(e) => setState((prev) => ({ ...prev, dateCalc: { ...prev.dateCalc, fromBase: e.target.value } }))} /></Field>
            <Field label="To base"><Input value={dateCalc.toBase} onChange={(e) => setState((prev) => ({ ...prev, dateCalc: { ...prev.dateCalc, toBase: e.target.value } }))} /></Field>
            <div className="flex items-end"><Button variant="outline" onClick={() => void runTool("CalcNumberBase", () => bindings.calcNumberBase(dateCalc.baseInput, Number(dateCalc.fromBase), Number(dateCalc.toBase)))} disabled={loading}>Convert Base</Button></div>
          </div>
        </div>
      </ToolCard>
    </>
  );
}

const selectClass =
  "h-11 w-full appearance-none rounded-2xl border border-white/10 bg-[#242424] px-4 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition [color-scheme:dark] focus:border-[#1ed760]/70 focus:ring-4 focus:ring-[#1ed760]/20";
