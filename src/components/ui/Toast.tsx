"use client";

import React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { Toast as ToastType } from "@/src/components/contexts/ToastContext";

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm animate-slide-in min-w-[300px] max-w-md",
        toast.type === "success" && "bg-success/10 border-success/20",
        toast.type === "error" && "bg-error/10 border-error/20",
        toast.type === "warning" && "bg-warning/10 border-warning/20",
        toast.type === "info" && "bg-info/10 border-info/20",
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5 flex-shrink-0 mt-0.5",
          toast.type === "success" && "text-success",
          toast.type === "error" && "text-error",
          toast.type === "warning" && "text-warning",
          toast.type === "info" && "text-info",
        )}
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-semibold text-sm",
            toast.type === "success" && "text-success",
            toast.type === "error" && "text-error",
            toast.type === "warning" && "text-warning",
            toast.type === "info" && "text-info",
          )}
        >
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-slate-300 mt-1">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  );
}
