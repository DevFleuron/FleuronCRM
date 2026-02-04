"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { TemplateCard } from "@/src/components/features/templates/TemplateCard";
import { TemplateModal } from "@/src/components/features/templates/TemplateModal";
import { useToast } from "@/src/components/contexts/ToastContext";
import { ApiService } from "@/src/lib/api";
import type { Template, TemplateFormData } from "@/src/types";

export default function TemplatesPage() {
  const { showToast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<
    Template | undefined
  >();
  const [typeFilter, setTypeFilter] = useState<"all" | "sms" | "email">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Confirmation modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ✅ Charger les templates au montage
  useEffect(() => {
    loadTemplates();
  }, []);

  // ✅ Fonction pour charger les templates
  const loadTemplates = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getTemplates();

      if (response.success) {
        setTemplates(response.data);
        console.log(`✅ ${response.data.length} templates chargés`);
      } else {
        showToast("error", "Erreur", "Impossible de charger les templates");
      }
    } catch (error: any) {
      console.error("❌ Erreur loadTemplates:", error);
      showToast("error", "Erreur", "Erreur lors du chargement des templates");
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesType = typeFilter === "all" || template.type === typeFilter;
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // ✅ Sauvegarder (create ou update)
  const handleSave = async (data: TemplateFormData) => {
    try {
      if (editingTemplate) {
        // UPDATE
        const response = await ApiService.updateTemplate(
          editingTemplate._id!,
          data,
        );

        if (response.success) {
          showToast(
            "success",
            "Template modifié",
            "Le template a été modifié avec succès",
          );
          await loadTemplates(); // Recharger
        } else {
          showToast("error", "Erreur", response.message);
        }
      } else {
        // CREATE
        const response = await ApiService.createTemplate(data);

        if (response.success) {
          showToast(
            "success",
            "Template créé",
            "Le template a été créé avec succès",
          );
          await loadTemplates(); // Recharger
        } else {
          showToast("error", "Erreur", response.message);
        }
      }

      setEditingTemplate(undefined);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("❌ Erreur handleSave:", error);
      showToast(
        "error",
        "Erreur",
        error.message || "Erreur lors de la sauvegarde",
      );
    }
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  // ✅ Confirmer la suppression
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await ApiService.deleteTemplate(deleteId);

      if (response.success) {
        showToast(
          "success",
          "Template supprimé",
          "Le template a été supprimé avec succès",
        );
        await loadTemplates(); // Recharger
      } else {
        showToast("error", "Erreur", response.message);
      }
    } catch (error: any) {
      console.error("❌ Erreur confirmDelete:", error);
      showToast(
        "error",
        "Erreur",
        error.message || "Erreur lors de la suppression",
      );
    } finally {
      setDeleteId(null);
      setIsConfirmOpen(false);
    }
  };

  // ✅ Loader pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Templates de relance
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Créez et gérez vos modèles de messages réutilisables (
            {templates.length} templates)
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            setEditingTemplate(undefined);
            setIsModalOpen(true);
          }}
          className="w-full lg:w-auto"
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
          <p className="text-slate-400">
            {searchQuery || typeFilter !== "all"
              ? "Aucun template trouvé"
              : "Aucun template. Créez-en un pour commencer !"}
          </p>
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

      {/* Modal Template */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTemplate(undefined);
        }}
        onSave={handleSave}
        template={editingTemplate}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
        title="Supprimer le template"
        message="Êtes-vous sûr de vouloir supprimer ce template ? Cette action est irréversible."
        type="danger"
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}
