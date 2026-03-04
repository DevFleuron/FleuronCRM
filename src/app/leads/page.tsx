"use client";

import React, { useState, useMemo, useEffect } from "react";
import { LeadFiltersBar } from "@/src/components/features/leads/LeadFilters";
import { LeadTable } from "@/src/components/features/leads/LeadTable";
import { LeadImportModal } from "@/src/components/features/leads/LeadImportModal";
import { useToast } from "@/src/components/contexts/ToastContext";
import type { Lead, LeadFilters } from "@/src/types";
import { ApiService } from "@/src/lib/api";
import { getDepartementsFromRegion } from "@/src/lib/regions";

export default function LeadsPage() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<LeadFilters>({});
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getLeads();
      if (response.success) {
        setLeads(response.data);
      } else {
        showToast("error", "Erreur", "Impossible de charger les leads");
      }
    } catch (error) {
      console.error("Erreur loadLeads:", error);
      showToast("error", "Erreur", "Erreur lors du chargement des leads");
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
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
      if (filters.rapport && lead.rapport !== filters.rapport) return false;
      if (filters.importId && String(lead.lastImportId) !== filters.importId)
        return false;
      if (filters.source && lead.source !== filters.source) return false;
      if (filters.dateFrom && new Date(lead.date) < new Date(filters.dateFrom))
        return false;
      if (filters.dateTo && new Date(lead.date) > new Date(filters.dateTo))
        return false;
      if (
        filters.typeInstallation &&
        lead.typeInstallation !== filters.typeInstallation
      )
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

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((lead) => lead._id!));
    }
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleImport = async (file: File) => {
    try {
      const response = await ApiService.importCSV(file);
      if (response.success) {
        showToast("success", "Import réussi !", response.message);
        await loadLeads();
      } else {
        showToast("error", "Erreur d'import", response.message);
      }
    } catch (error: any) {
      showToast("error", "Erreur", error.message || "Erreur lors de l'import");
    }
  };

  const handleSendSMS = (lead: Lead) => {
    showToast("info", "SMS", `SMS sera envoyé à ${lead.prenom} ${lead.nom}`);
  };

  const handleSendEmail = (lead: Lead) => {
    showToast(
      "info",
      "Email",
      `Email sera envoyé à ${lead.prenom} ${lead.nom}`,
    );
  };

  const handleViewDetails = (lead: Lead) => {
    console.log("View details:", lead);
  };

  const handleBulkSMS = () => {
    const selected = leads.filter((lead) => selectedIds.includes(lead._id!));
    showToast("info", "SMS groupé", `${selected.length} SMS seront envoyés`);
  };

  const handleBulkEmail = () => {
    const selected = leads.filter((lead) => selectedIds.includes(lead._id!));
    showToast(
      "info",
      "Email groupé",
      `${selected.length} emails seront envoyés`,
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Leads NRP</h1>
        <p className="text-text-secondary text-sm md:text-base">
          Gestion et relance des clients ({leads.length} leads)
        </p>
      </div>

      <LeadFiltersBar
        filters={filters}
        onFiltersChange={setFilters}
        onReset={handleResetFilters}
        onImport={() => setIsImportModalOpen(true)}
        resultsCount={filteredLeads.length}
      />

      <LeadTable
        leads={filteredLeads}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onSendSMS={handleSendSMS}
        onSendEmail={handleSendEmail}
        onViewDetails={handleViewDetails}
        onBulkSMS={handleBulkSMS}
        onBulkEmail={handleBulkEmail}
      />

      <LeadImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
