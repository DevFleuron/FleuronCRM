"use client";

import React, { useState, useEffect } from "react";
import { CampaignWizard } from "@/src/components/features/campaigns/CampaignWizard";
import { ApiService } from "@/src/lib/api";
import { useToast } from "@/src/components/contexts/ToastContext";
import type { Lead, Template } from "@/src/types";

export default function NewCampaignPage() {
  const { showToast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les leads et templates au montage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Charger en parallèle
      const [leadsResponse, templatesResponse] = await Promise.all([
        ApiService.getLeads({ rapport: "NRP" }), // Seulement les NRP
        ApiService.getTemplates(),
      ]);

      if (leadsResponse.success) {
        setLeads(leadsResponse.data);
        console.log(`✅ ${leadsResponse.data.length} leads NRP chargés`);
      }

      if (templatesResponse.success) {
        setTemplates(templatesResponse.data);
        console.log(`✅ ${templatesResponse.data.length} templates chargés`);
      }
    } catch (error: any) {
      console.error("❌ Erreur loadData:", error);
      showToast("error", "Erreur", "Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Nouvelle campagne
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Créez une campagne de relance SMS ou Email
        </p>
      </div>

      {/* Wizard */}
      <CampaignWizard leads={leads} templates={templates} />
    </div>
  );
}
