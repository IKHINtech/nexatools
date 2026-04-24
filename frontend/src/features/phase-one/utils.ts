export function splitLines(input: string): string[] {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function formatResultData(data: unknown): string {
  if (data === undefined || data === null) {
    return "No data returned.";
  }
  if (typeof data === "string") {
    return data;
  }
  return JSON.stringify(data, null, 2);
}
