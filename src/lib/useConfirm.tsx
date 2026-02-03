"use client";

import { useState } from "react";

interface ConfirmOptions {
  title: string;
  message: string;
  type?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
}

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: "",
    message: "",
  });
  const [resolveCallback, setResolveCallback] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = (opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolveCallback(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolveCallback) {
      resolveCallback(true);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolveCallback) {
      resolveCallback(false);
    }
  };

  return {
    confirm,
    isOpen,
    options,
    handleConfirm,
    handleCancel,
  };
}
