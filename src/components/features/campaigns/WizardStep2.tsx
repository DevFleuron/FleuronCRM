"use client";

import React, { useState } from "react";
import { MessageSquare, Mail, Search, AlertCircle } from "lucide-react";
import { Badge } from "@/src/components/ui/Badge";
import { cn } from "@/src/lib/utils";
import type { Template } from "@/src/types";

interface WizardStep2Props {
  templates: Template[];
  selectedTemplateId: string;
  campaignType: "sms" | "email" | null;
  onTemplateSelect: (id: string, type: "sms" | "email") => void;
}

export function WizardStep2({
  templates,
  selectedTemplateId,
  campaignType,
  onTemplateSelect,
}: WizardStep2Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    return campaignType
      ? template.type === campaignType && matchesSearch
      : matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Type Selection */}
      {!campaignType && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-indigo-400 mb-2">
                Choisissez le type de campagne
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => onTemplateSelect("", "sms")}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">
                    SMS
                  </span>
                </button>
                <button
                  onClick={() => onTemplateSelect("", "email")}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-300">
                    Email
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {campaignType && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="bg-[#111114] border border-slate-800 rounded-xl p-12 text-center">
              <p className="text-slate-400">
                Aucun template {campaignType === "sms" ? "SMS" : "Email"} trouvé
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template._id}
                  onClick={() => onTemplateSelect(template._id!, campaignType)}
                  className={cn(
                    "bg-[#111114] border rounded-xl p-5 text-left transition-all hover:border-slate-700",
                    selectedTemplateId === template._id
                      ? "border-indigo-500 ring-2 ring-indigo-500/20"
                      : "border-slate-800",
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          template.type === "email"
                            ? "bg-indigo-500/10 text-indigo-500"
                            : "bg-purple-500/10 text-purple-500"
                        }`}
                      >
                        {template.type === "email" ? (
                          <Mail className="w-5 h-5" />
                        ) : (
                          <MessageSquare className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{template.name}</h3>
                        <p className="text-xs text-slate-500">
                          {template.variables.length} variable
                          {template.variables.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    {selectedTemplateId === template._id && (
                      <Badge variant="success">Sélectionné</Badge>
                    )}
                  </div>

                  {template.subject && (
                    <p className="text-xs text-slate-500 mb-2">
                      Objet:{" "}
                      <span className="text-slate-400">{template.subject}</span>
                    </p>
                  )}

                  <p className="text-sm text-slate-400 line-clamp-2">
                    {template.content}
                  </p>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
