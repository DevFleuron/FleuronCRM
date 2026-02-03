"use client";

import React from "react";
import {
  Users,
  MessageSquare,
  Mail,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/src/components/ui/Badge";
import { Input } from "@/src/components/ui/Input";
import type { Lead, Template } from "@/src/types";

interface WizardStep3Props {
  campaignName: string;
  onCampaignNameChange: (name: string) => void;
  selectedLeads: Lead[];
  selectedTemplate: Template | null;
  scheduledAt?: Date;
  onScheduledAtChange: (date: Date | undefined) => void;
}

export function WizardStep3({
  campaignName,
  onCampaignNameChange,
  selectedLeads,
  selectedTemplate,
  scheduledAt,
  onScheduledAtChange,
}: WizardStep3Props) {
  return (
    <div className="space-y-6">
      {/* Campaign Name */}
      <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">Informations de la campagne</h3>
        <Input
          label="Nom de la campagne *"
          value={campaignName}
          onChange={(e) => onCampaignNameChange(e.target.value)}
          placeholder="Ex: Relance NRP Janvier 2026"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recipients */}
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h4 className="font-semibold">Destinataires</h4>
              <p className="text-xs text-slate-500">Leads sélectionnés</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-indigo-400">
            {selectedLeads.length}
          </p>
        </div>

        {/* Template */}
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedTemplate?.type === "email"
                  ? "bg-indigo-500/10 text-indigo-500"
                  : "bg-purple-500/10 text-purple-500"
              }`}
            >
              {selectedTemplate?.type === "email" ? (
                <Mail className="w-5 h-5" />
              ) : (
                <MessageSquare className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="font-semibold">Template</h4>
              <p className="text-xs text-slate-500">
                {selectedTemplate?.type === "email" ? "Email" : "SMS"}
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-300 truncate">
            {selectedTemplate?.name || "-"}
          </p>
        </div>
      </div>

      {/* Template Preview */}
      {selectedTemplate && (
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Aperçu du message</h3>
          {selectedTemplate.subject && (
            <div className="mb-3">
              <p className="text-xs text-slate-500 mb-1">Objet</p>
              <p className="text-sm font-medium text-slate-300">
                {selectedTemplate.subject}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-slate-500 mb-1">Contenu</p>
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 whitespace-pre-wrap">
              {selectedTemplate.content}
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Les variables seront remplacées automatiquement pour chaque
            destinataire
          </p>
        </div>
      )}

      {/* Schedule */}
      <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold">Planification</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="schedule"
              checked={!scheduledAt}
              onChange={() => onScheduledAtChange(undefined)}
              className="w-4 h-4 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <div>
              <p className="text-sm font-medium">Envoyer maintenant</p>
              <p className="text-xs text-slate-500">
                La campagne sera envoyée immédiatement
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="schedule"
              checked={!!scheduledAt}
              onChange={() => onScheduledAtChange(new Date())}
              className="w-4 h-4 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Planifier l'envoi</p>
              {scheduledAt !== undefined && (
                <input
                  type="datetime-local"
                  value={
                    scheduledAt instanceof Date
                      ? scheduledAt.toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) =>
                    onScheduledAtChange(
                      e.target.value ? new Date(e.target.value) : undefined,
                    )
                  }
                  className="w-full md:w-auto bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                />
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Success Info */}
      <div className="bg-success/10 border border-success/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-success mb-1">
              Campagne prête
            </p>
            <p className="text-xs text-success/80">
              Vérifiez les informations ci-dessus et cliquez sur "Envoyer" pour
              lancer la campagne
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
