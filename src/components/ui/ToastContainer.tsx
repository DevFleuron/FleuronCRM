"use client";

import React from "react";
import { Toast } from "./Toast";
import { useToast } from "@/src/components/contexts/ToastContext";

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[99999] space-y-3 pointer-events-none w-full max-w-md px-4">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
}
