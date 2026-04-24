import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-2xl border border-[var(--shell-border)] bg-[var(--shell-input)] px-4 py-2 text-base text-[var(--shell-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] outline-none transition-[color,box-shadow,border-color,background-color] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--shell-text)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "placeholder:text-[var(--shell-subtext)] selection:bg-[#1ed760] selection:text-[#04130a]",
        "focus-visible:border-[#1ed760]/70 focus-visible:ring-[3px] focus-visible:ring-[#1ed760]/20",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
