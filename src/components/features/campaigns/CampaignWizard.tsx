"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/Button";
import { ConfirmModal } from "@/src/components/ui/ConfirmModal";
import { useToast } from "@/src/components/contexts/ToastContext";
import { ApiService } from "@/src/lib/api";
import { WizardProgress } from "./WizardProgress";
import { WizardStep1 } from "./WizardStep1";
import { WizardStep2 } from "./WizardStep2";
import { WizardStep3 } from "./WizardStep3";
import type { Lead, Template, LeadFilters, WizardStep } from "@/src/types";

interface CampaignWizardProps {
  leads: Lead[];
  templates: Template[];
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
}

export function CampaignWizard({
  leads,
  templates,
  filters,
  onFiltersChange,
}: CampaignWizardProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [campaignType, setCampaignType] = useState<"sms" | "email" | null>(
    null,
  );
  const [campaignName, setCampaignName] = useState("");
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal de confirmation
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const steps: WizardStep[] = [
    {
      number: 1,
      title: "Destinataires",
      description: "Sélectionner les leads",
      isComplete: selectedLeadIds.length > 0,
    },
    {
      number: 2,
      title: "Template",
      description: "Choisir le message",
      isComplete: !!selectedTemplateId,
    },
    {
      number: 3,
      title: "Validation",
      description: "Récapitulatif",
      isComplete: !!campaignName,
    },
  ];

  const selectedLeads = leads.filter((lead) =>
    selectedLeadIds.includes(lead._id!),
  );
  const selectedTemplate =
    templates.find((t) => t._id === selectedTemplateId) || null;

  const canGoNext = () => {
    if (currentStep === 1) return selectedLeadIds.length > 0;
    if (currentStep === 2) return !!selectedTemplateId;
    if (currentStep === 3) return !!campaignName;
    return false;
  };

  const handleNext = () => {
    console.log("currentStep:", currentStep);
    if (currentStep === 1) {
      if (selectedLeadIds.length === 0) {
        showToast(
          "warning",
          "Aucun lead sélectionné",
          "Veuillez sélectionner au moins un destinataire pour continuer",
        );
        return;
      }
    }

    if (currentStep === 2) {
      if (!selectedTemplateId) {
        showToast(
          "warning",
          "Aucun template sélectionné",
          "Veuillez choisir un template SMS ou Email pour continuer",
        );
        return;
      }
    }

    if (currentStep === 3) {
      if (!campaignName) {
        showToast(
          "warning",
          "Nom de campagne manquant",
          "Veuillez donner un nom à votre campagne",
        );
        return;
      }
    }

    // Si tout est ok, passer à l'étape suivante
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleTemplateSelect = (id: string, type: "sms" | "email") => {
    setSelectedTemplateId(id);
    setCampaignType(type);

    if (!campaignName && id) {
      const template = templates.find((t) => t._id === id);
      const date = new Date().toLocaleDateString("fr-FR");
      setCampaignName(`${template?.name || "Campagne"} - ${date}`);
    }
  };

  // Ouvrir la confirmation
  const handleSendClick = () => {
    if (!campaignName || !selectedTemplateId || selectedLeadIds.length === 0) {
      showToast(
        "error",
        "Champs manquants",
        "Veuillez remplir tous les champs obligatoires",
      );
      return;
    }
    setIsConfirmOpen(true);
  };

  // Envoi après confirmation
  const handleConfirmSend = async () => {
    setIsSubmitting(true);

    try {
      const campaignData = {
        name: campaignName,
        type: campaignType,
        templateId: selectedTemplateId,
        recipients: selectedLeadIds,
        scheduledAt: scheduledAt ? scheduledAt.toISOString() : undefined,
      };

      console.log("Création campagne:", campaignData);

      const response = await ApiService.createCampaign(campaignData);

      console.log("Réponse:", response);

      if (response.success) {
        showToast(
          "success",
          "Campagne créée !",
          scheduledAt
            ? `"${campaignName}" sera envoyée le ${scheduledAt.toLocaleDateString("fr-FR")}`
            : `"${campaignName}" est en cours d'envoi`,
        );

        // Attendre 1.5s pour voir le toast
        await new Promise((resolve) => setTimeout(resolve, 1500));

        router.push("/campaign/history");
      } else {
        showToast(
          "error",
          "Erreur",
          response.message || "Erreur lors de la création",
        );
        setIsSubmitting(false);
        setIsConfirmOpen(false);
      }
    } catch (error: any) {
      console.error("Erreur création campagne:", error);
      showToast(
        "error",
        "Erreur",
        error.message || "Erreur lors de la création de la campagne",
      );
      setIsSubmitting(false);
      setIsConfirmOpen(false);
    }
  }; // ACCOLADE FERMANTE AJOUTÉE

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6 md:p-8">
        <WizardProgress steps={steps} currentStep={currentStep} />
      </div>

      {/* Content */}
      <div className="min-h-125">
        {currentStep === 1 && (
          <WizardStep1
            leads={leads}
            selectedIds={selectedLeadIds}
            onSelectionChange={setSelectedLeadIds}
            filters={filters}
            onFiltersChange={onFiltersChange}
          />
        )}

        {currentStep === 2 && (
          <WizardStep2
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            campaignType={campaignType}
            onTemplateSelect={handleTemplateSelect}
          />
        )}

        {currentStep === 3 && (
          <WizardStep3
            campaignName={campaignName}
            onCampaignNameChange={setCampaignName}
            selectedLeads={selectedLeads}
            selectedTemplate={selectedTemplate}
            scheduledAt={scheduledAt}
            onScheduledAtChange={setScheduledAt}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-30">
        <div className="text-sm text-slate-400 text-center sm:text-left">
          {currentStep === 1 && (
            <span>
              {selectedLeadIds.length} destinataire
              {selectedLeadIds.length > 1 ? "s" : ""} sélectionné
              {selectedLeadIds.length > 1 ? "s" : ""}
            </span>
          )}
          {currentStep === 2 && (
            <span>
              {selectedTemplateId
                ? "Template sélectionné"
                : "Choisissez un template"}
            </span>
          )}
          {currentStep === 3 && <span>Vérifiez et validez votre campagne</span>}
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          {currentStep > 1 && (
            <Button
              variant="secondary"
              size="lg"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial rounded-xl"
            >
              Retour
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleNext}
              className="flex-1 sm:flex-initial rounded-xl"
            >
              Suivant
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleSendClick}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial"
            >
              <Send className="w-5 h-5" />
              {scheduledAt ? "Planifier l'envoi" : "Envoyer maintenant"}
            </Button>
          )}
        </div>
      </div>

      {/* Modal de Confirmation */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSend}
        title="Confirmer l'envoi de la campagne"
        message={
          scheduledAt
            ? `Êtes-vous sûr de vouloir planifier la campagne "${campaignName}" pour ${selectedLeadIds.length} destinataire${selectedLeadIds.length > 1 ? "s" : ""} le ${scheduledAt.toLocaleDateString("fr-FR")} ?`
            : `Êtes-vous sûr de vouloir envoyer la campagne "${campaignName}" à ${selectedLeadIds.length} destinataire${selectedLeadIds.length > 1 ? "s" : ""} maintenant ?`
        }
        type="warning"
        confirmText={scheduledAt ? "Planifier" : "Envoyer"}
        cancelText="Annuler"
        isLoading={isSubmitting}
      />
    </div>
  );
}
