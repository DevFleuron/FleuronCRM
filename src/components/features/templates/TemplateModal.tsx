"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Eye } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { Select } from "@/src/components/ui/Select";
import type { Template, TemplateFormData } from "@/src/types";
import { TEMPLATE_VARIABLES } from "@/src/lib/constants";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TemplateFormData) => void;
  template?: Template; // Pour édition
}

export function TemplateModal({
  isOpen,
  onClose,
  onSave,
  template,
}: TemplateModalProps) {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: "",
    type: "sms",
    subject: "",
    content: "",
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        type: template.type,
        subject: template.subject || "",
        content: template.content,
      });
    } else {
      setFormData({
        name: "",
        type: "sms",
        subject: "",
        content: "",
      });
    }
  }, [template, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name || !formData.content) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (formData.type === "email" && !formData.subject) {
      alert("L'objet est obligatoire pour les emails");
      return;
    }

    onSave(formData);
    onClose();
  };

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const before = text.substring(0, start);
    const after = text.substring(end);

    setFormData({
      ...formData,
      content: before + `{{${variable}}}` + after,
    });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + variable.length + 4,
        start + variable.length + 4,
      );
    }, 0);
  };

  const previewContent = () => {
    let preview = formData.content;
    TEMPLATE_VARIABLES.forEach((v) => {
      preview = preview.replace(new RegExp(`{{${v.key}}}`, "g"), v.example);
    });
    return preview;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-[#111114] border border-slate-800 rounded-2xl animate-slide-in max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-[#111114] border-b border-slate-800 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold">
              {template ? "Modifier le template" : "Nouveau template"}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Créez un modèle réutilisable pour vos relances
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Type & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Type *"
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as "sms" | "email",
                })
              }
              options={[
                { value: "sms", label: "SMS" },
                { value: "email", label: "Email" },
              ]}
            />

            <Input
              label="Nom du template *"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Relance NRP - Premier contact"
            />
          </div>

          {/* Subject (Email only) */}
          {formData.type === "email" && (
            <Input
              label="Objet *"
              value={formData.subject || ""}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder="Objet de l'email"
            />
          )}

          {/* Variables */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
              Variables disponibles
            </label>
            <div className="flex flex-wrap gap-2">
              {TEMPLATE_VARIABLES.map((variable) => (
                <button
                  key={variable.key}
                  onClick={() => insertVariable(variable.key)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-400 rounded-lg text-sm font-medium transition-colors border border-slate-700 hover:border-indigo-500/50"
                >
                  <Plus className="w-3 h-3 inline mr-1" />
                  {variable.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Cliquez pour insérer une variable dans le contenu
            </p>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
                Contenu *
              </label>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
              >
                <Eye className="w-3 h-3" />
                {showPreview ? "Éditer" : "Prévisualiser"}
              </button>
            </div>

            {showPreview ? (
              <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 min-h-[200px] text-sm text-slate-300 whitespace-pre-wrap">
                {previewContent()}
              </div>
            ) : (
              <textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder={
                  formData.type === "sms"
                    ? "Bonjour {{prenom}} {{nom}}, nous revenons vers vous concernant..."
                    : "Bonjour {{prenom}},\n\nNous revenons vers vous..."
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors min-h-[200px] resize-y"
              />
            )}

            {formData.type === "sms" && (
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                <span>Les variables seront remplacées automatiquement</span>
                <span
                  className={
                    formData.content.length > 160 ? "text-warning" : ""
                  }
                >
                  {formData.content.length} / 160 caractères
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#111114] border-t border-slate-800 p-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {template ? "Enregistrer" : "Créer le template"}
          </Button>
        </div>
      </div>
    </div>
  );
}
