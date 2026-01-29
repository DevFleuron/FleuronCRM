import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full bg-surface-secondary border border-border-primary rounded-lg px-3 py-2.5",
            "text-text-primary text-sm",
            "transition-colors duration-200",
            "focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
            "cursor-pointer",
            error && "border-error focus:ring-error/20",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
