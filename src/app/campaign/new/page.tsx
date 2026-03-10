"use client";

import React, { useState, useEffect, useMemo } from "react";
import { CampaignWizard } from "@/src/components/features/campaigns/CampaignWizard";
import { ApiService } from "@/src/lib/api";
import { useToast } from "@/src/components/contexts/ToastContext";
import type { Lead, Template, LeadFilters } from "@/src/types";
import { getDepartementsFromRegion } from "@/src/lib/regions";

export default function NewCampaignPage() {
  const { showToast } = useToast();
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>({});

  const loadData = async (importId?: string, showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      const [leadsResponse, templatesResponse] = await Promise.all([
        ApiService.getLeads(
          importId ? { importId, all: "true" } : { all: "true" },
        ),
        ApiService.getTemplates(),
      ]);
      if (leadsResponse.success) setAllLeads(leadsResponse.data);
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

  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      if (filters.rapport && lead.rapport !== filters.rapport) return false;
      if (filters.departement) {
        const codePostal = (lead.codePostal || "").trim();
        if (!codePostal.startsWith(filters.departement)) return false;
      }
      if (filters.region) {
        const departements = getDepartementsFromRegion(filters.region);
        const codePostal = (lead.codePostal || "").trim();
        const dept = codePostal.substring(0, 2);
        if (!departements.includes(dept)) return false;
      }
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
        const s = filters.search.toLowerCase();
        return (
          lead.nom?.toLowerCase().includes(s) ||
          lead.prenom?.toLowerCase().includes(s) ||
          lead.email?.toLowerCase().includes(s) ||
          lead.mobile?.includes(s) ||
          lead.ref?.includes(s)
        );
      }
      return true;
    });
  }, [allLeads, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Nouvelle campagne
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Créez une campagne de relance SMS ou Email
        </p>
      </div>
      <CampaignWizard
        leads={filteredLeads}
        templates={templates}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
