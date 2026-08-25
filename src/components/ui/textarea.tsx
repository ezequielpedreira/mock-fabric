import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-24 w-full resize-y rounded-xl border border-input bg-card/80 px-3.5 py-3 text-base shadow-[0_1px_2px_oklch(0.2_0.04_255/0.035)] transition-[border-color,box-shadow,background-color] placeholder:text-muted-foreground/75 hover:border-primary/30 focus-visible:border-primary/55 focus-visible:bg-card focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/12 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
