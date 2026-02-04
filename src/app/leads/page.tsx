"use client";

import React, { useState, useMemo, useEffect } from "react";
import { LeadFiltersBar } from "@/src/components/features/leads/LeadFilters";
import { LeadTable } from "@/src/components/features/leads/LeadTable";
import { LeadImportModal } from "@/src/components/features/leads/LeadImportModal";
import { useToast } from "@/src/components/contexts/ToastContext";
import type { Lead, LeadFilters } from "@/src/types";
import { ApiService } from "@/src/lib/api";

export default function LeadsPage() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<LeadFilters>({});
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  //  Charger les leads au montage
  useEffect(() => {
    loadLeads();
  }, []);

  //  Fonction pour charger les leads depuis l'API
  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getLeads();

      if (response.success) {
        setLeads(response.data);
        console.log(` ${response.data.length} leads chargés`);
      } else {
        showToast("error", "Erreur", "Impossible de charger les leads");
      }
    } catch (error) {
      console.error("❌ Erreur loadLeads:", error);
      showToast("error", "Erreur", "Erreur lors du chargement des leads");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage côté client
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (filters.rapport && lead.rapport !== filters.rapport) return false;
      if (filters.source && lead.source !== filters.source) return false;
      if (filters.dateFrom) {
        const dateFrom = new Date(filters.dateFrom);
        if (new Date(lead.date) < dateFrom) return false;
      }
      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        if (new Date(lead.date) > dateTo) return false;
      }
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

  //  Import CSV connecté à l'API
  const handleImport = async (file: File) => {
    try {
      console.log("📤 Import en cours:", file.name);
      const response = await ApiService.importCSV(file);

      console.log("📦 Réponse complète:", JSON.stringify(response, null, 2));

      if (response.success) {
        //  Utiliser directement le message du backend
        showToast(
          "success",
          "Import réussi !",
          response.message, // "Import terminé: 0 nouveaux, 0 mis à jour, 0 erreurs"
        );

        //  Recharger les leads
        console.log("🔄 Rechargement des leads...");
        await loadLeads();
      } else {
        showToast("error", "Erreur d'import", response.message);
      }
    } catch (error: any) {
      console.error("❌ Erreur import:", error);
      showToast("error", "Erreur", error.message || "Erreur lors de l'import");
    }
  };

  const handleSendSMS = (lead: Lead) => {
    console.log(" Send SMS to:", lead);
    showToast("info", "SMS", `SMS sera envoyé à ${lead.prenom} ${lead.nom}`);
    // TODO: Implémenter l'envoi SMS avec Brevo
  };

  const handleSendEmail = (lead: Lead) => {
    console.log(" Send Email to:", lead);
    showToast(
      "info",
      "Email",
      `Email sera envoyé à ${lead.prenom} ${lead.nom}`,
    );
    // TODO: Implémenter l'envoi Email avec Brevo
  };

  const handleViewDetails = (lead: Lead) => {
    console.log("👁️ View details:", lead);
    // TODO: Ouvrir une modal avec les détails du lead
  };

  const handleBulkSMS = () => {
    const selected = leads.filter((lead) => selectedIds.includes(lead._id!));
    console.log("📱 Send SMS to selected:", selected);
    showToast("info", "SMS groupé", `${selected.length} SMS seront envoyés`);
    // TODO: Implémenter l'envoi groupé
  };

  const handleBulkEmail = () => {
    const selected = leads.filter((lead) => selectedIds.includes(lead._id!));
    console.log("📧 Send Email to selected:", selected);
    showToast(
      "info",
      "Email groupé",
      `${selected.length} emails seront envoyés`,
    );
    // TODO: Implémenter l'envoi groupé
  };

  //  Afficher un loader pendant le chargement
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
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Leads NRP</h1>
        <p className="text-text-secondary text-sm md:text-base">
          Gestion et relance des clients ({leads.length} leads)
        </p>
      </div>

      {/* Filtres */}
      <LeadFiltersBar
        filters={filters}
        onFiltersChange={setFilters}
        onReset={handleResetFilters}
        onImport={() => setIsImportModalOpen(true)}
        resultsCount={filteredLeads.length}
      />

      {/* Tableau */}
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

      {/* Modal Import */}
      <LeadImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
