import { type HTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
}

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide",

        variant === "success" && "bg-success/10 text-success",
        variant === "warning" && "bg-warning/10 text-warning",
        variant === "error" && "bg-error/10 text-error",
        variant === "info" && "bg-info/10 text-info",
        variant === "neutral" && "bg-surface-secondary text-text-secondary",

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
