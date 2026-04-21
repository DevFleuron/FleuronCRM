"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { useToast } from "@/src/components/contexts/ToastContext";
import { ApiService } from "@/src/lib/api";
import type { Lead, Template, LeadFilters } from "@/src/types";
import { LeadFiltersBar } from "@/src/components/features/leads/LeadFilters";
import { getDepartementsFromRegion } from "@/src/lib/regions";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Step {
  id: string;
  type: "sms" | "email";
  templateId: string;
  delayDays: number;
}

function SortableStep({
  step,
  index,
  templates,
  onUpdate,
  onDelete,
  canDelete,
}: {
  step: Step;
  index: number;
  templates: Template[];
  onUpdate: (id: string, field: keyof Step, value: any) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const filteredTemplates = templates.filter((t) => t.type === step.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
    >
      <div className="flex items-start gap-4">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="mt-2 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <h3 className="font-medium">
                Étape {index + 1}
                {index > 0 &&
                  ` (${step.delayDays} jours après l'étape ${index})`}
              </h3>
            </div>
            {canDelete && (
              <button
                onClick={() => onDelete(step.id)}
                className="text-slate-500 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Type selection */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => onUpdate(step.id, "type", "sms")}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  step.type === "sms"
                    ? "border-purple-500 bg-purple-500/10 text-purple-400"
                    : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                <MessageSquare className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">SMS</span>
              </button>
              <button
                onClick={() => onUpdate(step.id, "type", "email")}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  step.type === "email"
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                    : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                }`}
              >
                <Mail className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">Email</span>
              </button>
            </div>
          </div>

          {/* Template & Delay */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Template
              </label>
              <select
                value={step.templateId}
                onChange={(e) =>
                  onUpdate(step.id, "templateId", e.target.value)
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Sélectionner un template</option>
                {filteredTemplates.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {index > 0 && (
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Délai (jours)
                </label>
                <input
                  type="number"
                  min="0"
                  value={step.delayDays}
                  onChange={(e) =>
                    onUpdate(
                      step.id,
                      "delayDays",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewSequencePage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [sequenceName, setSequenceName] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<LeadFilters>({});
  const [sequenceError, setSequenceError] = useState<{
    message: string;
    excludedLeads: string[];
  } | null>(null);

  // Steps avec ID unique pour le drag & drop
  const [steps, setSteps] = useState<Step[]>([
    { id: crypto.randomUUID(), type: "sms", templateId: "", delayDays: 0 },
    { id: crypto.randomUUID(), type: "email", templateId: "", delayDays: 2 },
    { id: crypto.randomUUID(), type: "sms", templateId: "", delayDays: 3 },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (importId?: string, showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const [leadsResponse, templatesResponse] = await Promise.all([
        ApiService.getLeads(
          importId ? { importId, all: "true" } : { all: "true" },
        ),
        ApiService.getTemplates(),
      ]);
      if (leadsResponse.success) setLeads(leadsResponse.data);
      if (templatesResponse.success) setTemplates(templatesResponse.data);
    } catch (error: any) {
      showToast("error", "Erreur", "Impossible de charger les données");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (filters.importId !== undefined) {
      loadData(filters.importId, false);
    }
  }, [filters.importId]);

  // Filtrage côté client
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Filtre par département
      if (filters.departement) {
        const codePostal = (lead.codePostal || "").trim();
        if (!codePostal.startsWith(filters.departement)) return false;
      }
      if (filters.rapport && lead.rapport !== filters.rapport) return false;

      // Filtre par région
      if (filters.region) {
        const departements = getDepartementsFromRegion(filters.region);
        const codePostal = (lead.codePostal || "").trim();
        const dept = codePostal.substring(0, 2);
        if (!departements.includes(dept)) return false;
      }

      // Autres filtres
      if (filters.source && lead.source !== filters.source) return false;
      if (
        filters.typeInstallation &&
        lead.typeInstallation !== filters.typeInstallation
      )
        return false;
      if (filters.dateFrom && new Date(lead.date) < new Date(filters.dateFrom))
        return false;
      if (filters.dateTo && new Date(lead.date) > new Date(filters.dateTo))
        return false;
      if (filters.smsEnvoye === "yes" && !lead.smsEnvoye) return false;
      if (filters.smsEnvoye === "no" && lead.smsEnvoye) return false;
      if (filters.emailEnvoye === "yes" && !lead.emailEnvoye) return false;
      if (filters.emailEnvoye === "no" && lead.emailEnvoye) return false;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          lead.nom?.toLowerCase().includes(searchLower) ||
          lead.prenom?.toLowerCase().includes(searchLower) ||
          lead.email?.toLowerCase().includes(searchLower) ||
          lead.mobile?.includes(searchLower) ||
          lead.ref?.includes(searchLower)
        );
      }

      return true;
    });
  }, [leads, filters]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleUpdateStep = (id: string, field: keyof Step, value: any) => {
    setSteps(
      steps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step,
      ),
    );
  };

  const handleAddStep = () => {
    const newStep: Step = {
      id: crypto.randomUUID(),
      type: "sms",
      templateId: "",
      delayDays: steps.length > 0 ? 3 : 0,
    };
    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  const handleSelectAllLeads = () => {
    if (selectedLeadIds.length === filteredLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(filteredLeads.map((l) => l._id!));
    }
  };

  const handleToggleLead = (leadId: string) => {
    if (selectedLeadIds.includes(leadId)) {
      setSelectedLeadIds(selectedLeadIds.filter((id) => id !== leadId));
    } else {
      setSelectedLeadIds([...selectedLeadIds, leadId]);
    }
  };

  const handleSubmit = async () => {
    if (!sequenceName.trim()) {
      showToast("error", "Erreur", "Veuillez donner un nom à la séquence");
      return;
    }

    if (selectedLeadIds.length === 0) {
      showToast("error", "Erreur", "Veuillez sélectionner au moins un lead");
      return;
    }

    if (steps.length === 0) {
      showToast("error", "Erreur", "Veuillez ajouter au moins une étape");
      return;
    }

    const invalidSteps = steps.filter((s) => !s.templateId);
    if (invalidSteps.length > 0) {
      showToast(
        "error",
        "Erreur",
        "Veuillez sélectionner un template pour chaque étape",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // Préparer les steps sans les IDs (juste pour le backend)
      const stepsForBackend = steps.map((step, index) => ({
        type: step.type,
        templateId: step.templateId,
        delayDays: index === 0 ? 0 : step.delayDays,
      }));

      const response = await ApiService.createSequence({
        name: sequenceName,
        steps: stepsForBackend,
        leadIds: selectedLeadIds,
      });

      if (response.success) {
        showToast(
          "success",
          "Séquence créée",
          `La séquence "${sequenceName}" a été lancée`,
        );
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push("/sequences");
      } else if (response.error === "LEADS_ALREADY_IN_SEQUENCE") {
        setSequenceError({
          message: response.message,
          excludedLeads: response.excludedLeads || [],
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        showToast(
          "error",
          "Erreur",
          response.message || "Erreur lors de la création",
        );
      }
    } catch (error: any) {
      console.error("Erreur création séquence:", error);
      showToast("error", "Erreur", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Nouvelle séquence automatique
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Configurez vos étapes et réorganisez-les par glisser-déposer
          </p>
        </div>
      </div>

      {/* Bannière erreur leads déjà en séquence */}
      {sequenceError && (
        <div className="bg-error/10 border border-error/30 rounded-2xl p-6">
          <h3 className="text-error font-semibold mb-3">
            ⚠️ {sequenceError.message}
          </h3>
          <p className="text-sm text-slate-400 mb-2">
            Les leads suivants sont déjà dans une séquence active :
          </p>
          <ul className="space-y-1">
            {sequenceError.excludedLeads.map((lead, i) => (
              <li
                key={i}
                className="text-sm text-slate-300 flex items-center gap-2"
              >
                <span className="text-error">•</span>
                {lead}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setSequenceError(null)}
            className="mt-4 text-sm text-slate-400 hover:text-slate-200"
          >
            Fermer
          </button>
        </div>
      )}

      {/* Nom */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Nom de la séquence
        </label>
        <input
          type="text"
          value={sequenceName}
          onChange={(e) => setSequenceName(e.target.value)}
          placeholder="Ex: Relance NRP Février 2026"
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Steps */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Étapes ({steps.length})</h2>
          <Button variant="secondary" size="sm" onClick={handleAddStep}>
            Ajouter une étape
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={steps.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {steps.map((step, index) => (
                <SortableStep
                  key={step.id}
                  step={step}
                  index={index}
                  templates={templates}
                  onUpdate={handleUpdateStep}
                  onDelete={handleDeleteStep}
                  canDelete={steps.length > 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Leads */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Leads ({selectedLeadIds.length} / {filteredLeads.length})
          </h2>
        </div>

        {/* Filtres */}
        <LeadFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          onReset={() => setFilters({})}
          resultsCount={filteredLeads.length}
        />

        {/* Liste des leads */}
        <div className="flex justify-end">
          <Button variant="secondary" size="sm" onClick={handleSelectAllLeads}>
            {selectedLeadIds.length === filteredLeads.length
              ? "Tout désélectionner"
              : "Tout sélectionner"}
          </Button>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredLeads.map((lead) => (
            <label
              key={lead._id}
              className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-900 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedLeadIds.includes(lead._id!)}
                onChange={() => handleToggleLead(lead._id!)}
                className="w-5 h-5 rounded border-slate-600 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
              <div className="flex-1">
                <p className="font-medium">
                  {lead.prenom} {lead.nom}
                </p>
                <p className="text-sm text-slate-400">
                  {lead.ref} • {lead.mobile} • {lead.rapport}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={
            isSubmitting || selectedLeadIds.length === 0 || steps.length === 0
          }
          className="flex-1"
        >
          {isSubmitting
            ? "Création en cours..."
            : `Lancer la séquence (${selectedLeadIds.length} leads)`}
        </Button>
      </div>
    </div>
  );
}
