import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold cursor-pointer transition-[transform,box-shadow,background-color,border-color,color,opacity] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_10px_24px_-14px_color-mix(in_oklch,var(--primary)_75%,transparent)] hover:bg-primary/92 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-16px_color-mix(in_oklch,var(--primary)_80%,transparent)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:-translate-y-0.5",
        outline:
          "border border-input bg-card/80 text-foreground shadow-[0_1px_2px_oklch(0.2_0.04_255/0.04)] hover:-translate-y-0.5 hover:border-primary/35 hover:bg-secondary hover:text-secondary-foreground hover:shadow-md",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:-translate-y-0.5 hover:bg-secondary/75 hover:shadow-md",
        ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "fabric-gradient isolate overflow-hidden border border-white/15 text-white shadow-[0_18px_38px_-18px_color-mix(in_oklch,var(--primary)_90%,transparent)] after:pointer-events-none after:absolute after:inset-y-0 after:-left-1/2 after:w-1/3 after:bg-white/25 after:blur-xl hover:-translate-y-0.5 hover:shadow-[0_24px_46px_-20px_color-mix(in_oklch,var(--primary)_95%,transparent)] hover:after:animate-[sheen_900ms_ease-out]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-11 min-w-11 rounded-lg px-3 text-xs sm:h-9 sm:min-w-9",
        lg: "h-11 px-7",
        xl: "h-13 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
