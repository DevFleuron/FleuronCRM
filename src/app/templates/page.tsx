"use client";

import React, { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { TemplateCard } from "@/src/components/features/templates/TemplateCard";
import { TemplateModal } from "@/src/components/features/templates/TemplateModal";
import type { Template, TemplateFormData } from "@/src/types";

// Données mockées
const MOCK_TEMPLATES: Template[] = [
  {
    _id: "1",
    name: "Relance NRP - Premier contact",
    type: "sms",
    content:
      "Bonjour {{prenom}} {{nom}}, nous revenons vers vous concernant votre projet {{typeInstallation}}. Êtes-vous disponible pour en discuter ? REF: {{ref}}",
    variables: ["prenom", "nom", "typeInstallation", "ref"],
    createdAt: new Date("2026-01-20"),
    usageCount: 45,
  },
  {
    _id: "2",
    name: "Email de suivi ITE",
    type: "email",
    subject: "Votre projet d'isolation - REF {{ref}}",
    content:
      "Bonjour {{prenom}},\n\nNous revenons vers vous concernant votre demande d'isolation thermique extérieure.\n\nNotre équipe est disponible pour répondre à vos questions.\n\nCordialement,\nL'équipe Fleuron Industries",
    variables: ["prenom", "ref"],
    createdAt: new Date("2026-01-15"),
    usageCount: 23,
  },
  {
    _id: "3",
    name: "Rappel RDV",
    type: "sms",
    content:
      "Rappel : RDV prévu demain pour votre projet {{typeInstallation}}. Confirmez-vous ? REF: {{ref}}",
    variables: ["typeInstallation", "ref"],
    createdAt: new Date("2026-01-10"),
    usageCount: 67,
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<
    Template | undefined
  >();
  const [typeFilter, setTypeFilter] = useState<"all" | "sms" | "email">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesType = typeFilter === "all" || template.type === typeFilter;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSave = (data: TemplateFormData) => {
    if (editingTemplate) {
      // Update
      setTemplates(
        templates.map((t) =>
          t._id === editingTemplate._id
            ? {
                ...t,
                ...data,
                variables: extractVariables(data.content),
                updatedAt: new Date(),
              }
            : t,
        ),
      );
    } else {
      // Create
      const newTemplate: Template = {
        _id: Date.now().toString(),
        ...data,
        variables: extractVariables(data.content),
        createdAt: new Date(),
        usageCount: 0,
      };
      setTemplates([newTemplate, ...templates]);
    }
    setEditingTemplate(undefined);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) {
      setTemplates(templates.filter((t) => t._id !== id));
    }
  };

  const extractVariables = (content: string): string[] => {
    const regex = /{{(\w+)}}/g;
    const matches = content.matchAll(regex);
    return Array.from(new Set(Array.from(matches, (m) => m[1])));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Templates de relance
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Créez et gérez vos modèles de messages réutilisables
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            setEditingTemplate(undefined);
            setIsModalOpen(true);
          }}
          className="w-full lg:w-auto rounded-xl"
        >
          Nouveau Template
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher un template..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === "all"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Tous ({templates.length})
            </button>
            <button
              onClick={() => setTypeFilter("sms")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === "sms"
                  ? "bg-purple-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              SMS ({templates.filter((t) => t.type === "sms").length})
            </button>
            <button
              onClick={() => setTypeFilter("email")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === "email"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Email ({templates.filter((t) => t.type === "email").length})
            </button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-[#111114] border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400">Aucun template trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTemplate(undefined);
        }}
        onSave={handleSave}
        template={editingTemplate}
      />
    </div>
  );
}
