import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "button-base",

          variant === "primary" && [
            "bg-brand-primary text-white",
            "hover:bg-brand-primary/90",
            "shadow-md hover:shadow-lg",
          ],
          variant === "secondary" && [
            "bg-surface-primary text-text-primary",
            "border border-border-primary",
            "hover:bg-surface-hover",
          ],
          variant === "ghost" && [
            "text-text-secondary",
            "hover:bg-surface-hover hover:text-text-primary",
          ],
          variant === "danger" && ["bg-error text-white", "hover:bg-error/90"],

          size === "sm" && "px-3 py-1.5 text-sm gap-1.5",
          size === "md" && "px-4 py-2.5 text-sm gap-2",
          size === "lg" && "px-6 py-3 text-base gap-2",

          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
