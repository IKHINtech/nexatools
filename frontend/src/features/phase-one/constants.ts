import type { ActiveGroup } from "./types";

export const navItems: Array<{
  id: ActiveGroup;
  label: string;
  prefix: string;
  tone: string;
}> = [
  { id: "text", label: "Text & Data", prefix: "text.", tone: "from-amber-400/25 to-transparent" },
  { id: "calc", label: "Calculators", prefix: "calc.", tone: "from-emerald-400/25 to-transparent" },
  { id: "qr", label: "QR & Barcodes", prefix: "qr.", tone: "from-cyan-400/25 to-transparent" },
  { id: "security", label: "Security", prefix: "security.", tone: "from-red-400/20 to-transparent" },
  { id: "archive", label: "Archive Tools", prefix: "archive.", tone: "from-orange-500/25 to-transparent" },
];
