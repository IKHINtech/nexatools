import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-16 w-full rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-input)] px-4 py-3 text-base text-[var(--shell-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition-[color,box-shadow,border-color,background-color] placeholder:text-[var(--shell-subtext)] focus-visible:border-[#1ed760]/70 focus-visible:ring-[3px] focus-visible:ring-[#1ed760]/20 aria-invalid:ring-destructive/20 aria-invalid:border-destructive dark:aria-invalid:ring-destructive/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
