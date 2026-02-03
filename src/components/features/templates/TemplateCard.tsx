"use client";

import React from "react";
import { MessageSquare, Mail, Edit, Trash2, Copy } from "lucide-react";
import { Badge } from "@/src/components/ui/Badge";
import type { Template } from "@/src/types";
import { formatDate } from "@/src/lib/utils";

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (id: string) => void;
}

export function TemplateCard({
  template,
  onEdit,
  onDelete,
}: TemplateCardProps) {
  return (
    <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              template.type === "email"
                ? "bg-indigo-500/10 text-indigo-500"
                : "bg-purple-500/10 text-purple-500"
            }`}
          >
            {template.type === "email" ? (
              <Mail className="w-6 h-6" />
            ) : (
              <MessageSquare className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-lg">{template.name}</h3>
            <p className="text-xs text-slate-500">
              Créé le {formatDate(template.createdAt || new Date())}
            </p>
          </div>
        </div>
        <Badge variant={template.type === "email" ? "info" : "neutral"}>
          {template.type.toUpperCase()}
        </Badge>
      </div>

      {template.subject && (
        <div className="mb-3">
          <p className="text-xs text-slate-500 mb-1">Objet</p>
          <p className="text-sm font-medium text-slate-300">
            {template.subject}
          </p>
        </div>
      )}

      <div className="mb-4">
        <p className="text-xs text-slate-500 mb-2">Contenu</p>
        <p className="text-sm text-slate-400 line-clamp-3">
          {template.content}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>
            {template.variables.length} variable
            {template.variables.length > 1 ? "s" : ""}
          </span>
          <span>•</span>
          <span>
            {template.usageCount || 0} utilisation
            {template.usageCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(template)}
            className="p-2 hover:bg-indigo-500/10 rounded-lg text-indigo-500 hover:text-indigo-400 transition-colors"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(template._id!)}
            className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 hover:text-red-400 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
