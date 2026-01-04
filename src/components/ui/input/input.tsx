import * as React from "react"
import { cn } from '../../../lib/utils/shadUtils'


function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/60",
        "selection:bg-primary selection:text-primary-foreground",
        "dark:bg-input/20 border-input/50 dark:border-input/30",
        "h-12 w-full min-w-0 rounded-xl border-2 bg-background/50 backdrop-blur-sm",
        "px-4 py-2 text-base shadow-sm",
        "transition-all duration-300 ease-out",
        "outline-none",
        "file:inline-flex file:h-8 file:border-0 file:bg-primary/10 file:rounded-lg file:px-3 file:text-sm file:font-medium file:mr-3",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "md:text-sm",
        "focus:border-primary focus:ring-4 focus:ring-primary/10 focus:shadow-md focus:shadow-primary/5",
        "hover:border-primary/50 hover:shadow-sm",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:focus:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
