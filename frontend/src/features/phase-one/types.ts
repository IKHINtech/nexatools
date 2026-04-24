export type ToolError = {
  code: string;
  message: string;
};

export type ToolResult<T> = {
  success: boolean;
  data?: T;
  error?: ToolError;
  trace_id: string;
};

export type ToolInfo = {
  id: string;
  category: string;
  status: string;
  dependencies?: string[];
  description?: string;
};

export type WordStats = {
  characters: number;
  characters_no_spaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  estimated_reading_min: number;
};

export type ZIPEntry = {
  name: string;
  compressed_size: number;
  uncompressed_size: number;
  modified: string;
};

export type ActiveGroup = "text" | "calc" | "security" | "qr" | "archive";

export type RunState = {
  title: string;
  result: ToolResult<unknown> | null;
};

export type TextState = {
  jsonInput: string;
  jsonIndent: string;
  textInput: string;
  caseMode: string;
  loremConfig: {
    paragraphs: number;
    sentences: number;
    words: number;
  };
  csvJsonInput: string;
};

export type CalcState = {
  basicCalc: {
    op: string;
    x: string;
    y: string;
  };
  unitCalc: {
    category: string;
    value: string;
    from: string;
    to: string;
  };
  percentageCalc: {
    mode: string;
    x: string;
    y: string;
  };
  dateCalc: {
    start: string;
    end: string;
    date: string;
    days: string;
    timestamp: string;
    iso: string;
    baseInput: string;
    fromBase: string;
    toBase: string;
  };
};

export type SecurityState = {
  passwordConfig: {
    length: string;
    lower: boolean;
    upper: boolean;
    digits: boolean;
    symbols: boolean;
  };
  hashTextState: {
    algorithm: string;
    input: string;
  };
  hashFileState: {
    algorithm: string;
    path: string;
  };
};

export type QRState = {
  qrState: {
    content: string;
    size: string;
    outputPath: string;
    inputPath: string;
  };
  barcodeState: {
    format: string;
    content: string;
    outputPath: string;
  };
};

export type ArchiveState = {
  archiveCreateState: {
    outputPath: string;
    inputPaths: string;
  };
  archiveExtractState: {
    zipPath: string;
    outputDir: string;
  };
  archiveInfoPath: string;
};
