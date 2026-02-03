"use client";

import React, { useState } from "react";
import { X, Upload, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";
import { useToast } from "@/src/components/contexts/ToastContext";

interface LeadImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

export function LeadImportModal({
  isOpen,
  onClose,
  onImport,
}: LeadImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".csv")) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Veuillez déposer un fichier CSV valide");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Veuillez sélectionner un fichier CSV");
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      await onImport(file);
      setSuccess(true);
      showToast(
        "success",
        "Import réussi",
        "Les leads ont été importés avec succès",
      );
      setTimeout(() => {
        onClose();
        setFile(null);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de l'import";
      setError(errorMessage);
      showToast("error", "Erreur d'import", errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl card-base animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary/10 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Importer des leads</h2>
              <p className="text-sm text-text-secondary">
                Fichier CSV depuis le CRM
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center transition-all",
              isDragging && "border-brand-primary bg-brand-primary/5",
              !isDragging &&
                "border-border-primary hover:border-border-secondary",
              file && "bg-success/5 border-success",
            )}
          >
            {file ? (
              <div className="space-y-3">
                <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
                <div>
                  <p className="font-semibold text-text-primary">{file.name}</p>
                  <p className="text-sm text-text-secondary">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-text-secondary hover:text-text-primary underline"
                >
                  Changer de fichier
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <FileText className="w-12 h-12 text-text-tertiary mx-auto" />
                <div>
                  <p className="font-semibold text-text-primary mb-1">
                    Glissez-déposez votre fichier CSV ici
                  </p>
                  <p className="text-sm text-text-secondary">ou</p>
                </div>
                <label className="inline-block">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-secondary hover:bg-surface-hover border border-border-primary rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    Parcourir les fichiers
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="bg-info/10 border border-info/20 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-2">
                <p className="font-semibold text-info">Format attendu</p>
                <p className="text-text-secondary"> CSV</p>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                <p className="text-sm text-error">{error}</p>
              </div>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                <p className="text-sm text-success">
                  Import réussi ! Redirection...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border-primary">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isUploading}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleImport}
            disabled={!file || isUploading || success}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Import en cours...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Importer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
