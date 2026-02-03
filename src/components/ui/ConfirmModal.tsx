"use client";

import React from "react";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/src/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "danger",
  confirmText = "Confirmer",
  cancelText = "Annuler",
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const icons = {
    danger: XCircle,
    warning: AlertTriangle,
    info: Info,
    success: CheckCircle,
  };

  const Icon = icons[type];

  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#111114] border border-slate-800 rounded-2xl p-6 max-w-md w-full animate-slide-in shadow-2xl">
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4",
            type === "danger" && "bg-error/10",
            type === "warning" && "bg-warning/10",
            type === "info" && "bg-info/10",
            type === "success" && "bg-success/10",
          )}
        >
          <Icon
            className={cn(
              "w-6 h-6",
              type === "danger" && "text-error",
              type === "warning" && "text-warning",
              type === "info" && "text-info",
              type === "success" && "text-success",
            )}
          />
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-slate-400">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={type === "danger" ? "danger" : "primary"}
            size="lg"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                En cours...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
