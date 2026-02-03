"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/Button";
import { WizardProgress } from "./WizardProgress";
import { WizardStep1 } from "./WizardStep1";
import { WizardStep2 } from "./WizardStep2";
import { WizardStep3 } from "./WizardStep3";
import type { Lead, Template, WizardStep } from "@/src/types";

interface CampaignWizardProps {
  leads: Lead[];
  templates: Template[];
}

export function CampaignWizard({ leads, templates }: CampaignWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [campaignType, setCampaignType] = useState<"sms" | "email" | null>(
    null,
  );
  const [campaignName, setCampaignName] = useState("");
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (canGoNext() && currentStep < 3) {
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

    // Auto-générer un nom de campagne
    if (!campaignName && id) {
      const template = templates.find((t) => t._id === id);
      const date = new Date().toLocaleDateString("fr-FR");
      setCampaignName(`${template?.name || "Campagne"} - ${date}`);
    }
  };

  const handleSubmit = async () => {
    if (!campaignName || !selectedTemplateId || selectedLeadIds.length === 0) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Appeler l'API pour créer la campagne
      const campaignData = {
        name: campaignName,
        type: campaignType,
        templateId: selectedTemplateId,
        recipients: selectedLeadIds,
        scheduledAt: scheduledAt,
      };

      console.log("Creating campaign:", campaignData);

      // Simuler un délai
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(
        `Campagne "${campaignName}" créée avec succès ! ${scheduledAt ? "Elle sera envoyée à la date prévue." : "Envoi en cours..."}`,
      );

      router.push("/campaigns/history");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Erreur lors de la création de la campagne");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6 md:p-8">
        <WizardProgress steps={steps} currentStep={currentStep} />
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {currentStep === 1 && (
          <WizardStep1
            leads={leads}
            selectedIds={selectedLeadIds}
            onSelectionChange={setSelectedLeadIds}
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
              className="flex-1 sm:flex-initial"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              variant="primary"
              size="lg"
              onClick={handleNext}
              disabled={!canGoNext()}
              className="flex-1 sm:flex-initial"
            >
              Suivant
              <ArrowRight className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={!canGoNext() || isSubmitting}
              className="flex-1 sm:flex-initial"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {scheduledAt ? "Planifier l'envoi" : "Envoyer maintenant"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
