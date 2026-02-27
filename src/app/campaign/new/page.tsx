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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [leadsResponse, templatesResponse] = await Promise.all([
        ApiService.getLeads({ rapport: "NRP" }),
        ApiService.getTemplates(),
      ]);

      if (leadsResponse.success) {
        setAllLeads(leadsResponse.data);
        console.log(`${leadsResponse.data.length} leads NRP chargés`);
      }

      if (templatesResponse.success) {
        setTemplates(templatesResponse.data);
        console.log(`${templatesResponse.data.length} templates chargés`);
      }
    } catch (error: any) {
      console.error("Erreur loadData:", error);
      showToast("error", "Erreur", "Impossible de charger les données");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage côté client
  const filteredLeads = useMemo(() => {
    return allLeads.filter((lead) => {
      // Filtre par département
      if (filters.departement) {
        const codePostal = (lead.codePostal || "").trim();
        if (!codePostal.startsWith(filters.departement)) return false;
      }

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
  }, [allLeads, filters]);

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
