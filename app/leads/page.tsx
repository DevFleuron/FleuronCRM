"use client";

import React, { useState, useMemo } from "react";
import { LeadFiltersBar } from "@/components/features/leads/LeadFilters";
import { LeadTable } from "@/components/features/leads/LeadTable";
import { LeadImportModal } from "@/components/features/leads/LeadImportModal";
import type { Lead, LeadFilters } from "@/types";

// Données mockées (gardées telles quelles)
const MOCK_LEADS: Lead[] = [
  {
    _id: "1",
    ref: "47750",
    date: new Date("2026-01-26"),
    heure: "11:49",
    nom: "VICHERAT",
    prenom: "ANTHONY",
    mobile: "06 23 17 56 85",
    email: "anthony.vicherat@laposte.net",
    adresse: "",
    codePostal: "55300",
    source: "LOGICALL",
    telepro: "JANIN JESSICA",
    equipe: "Fleuron Industries",
    rapport: "NRP",
    observation: "par JESSICA JANIN 26/01/2026 16:53 : NRP/ msg laisser",
    typeInstallation: "ITE",
    smsEnvoye: false,
    smsCount: 0,
    emailEnvoye: false,
    emailCount: 0,
    importedAt: new Date(),
  },
  {
    _id: "2",
    ref: "47770",
    date: new Date("2026-01-26"),
    heure: "11:49",
    nom: "IMNO",
    prenom: "ANNE",
    mobile: "06 61 78 78 07",
    email: "christyann@laposte.net",
    adresse: "",
    codePostal: "15140",
    source: "LOGICALL",
    telepro: "RIBERTE MICKAEL",
    equipe: "",
    rapport: "NRP",
    observation: "par POMELO 27/01/2026 19:24 : NOUVEAU PROSPECT => NRP",
    typeInstallation: "ITE",
    smsEnvoye: true,
    smsCount: 2,
    emailEnvoye: false,
    emailCount: 0,
    importedAt: new Date(),
  },
  {
    _id: "3",
    ref: "47771",
    date: new Date("2026-01-26"),
    heure: "11:49",
    nom: "FATA",
    prenom: "SAID",
    mobile: "06 76 58 23 13",
    email: "hadjimoussa254@gmail.com",
    adresse: "",
    codePostal: "13003",
    source: "LOGICALL",
    telepro: "BELLON ERIC",
    equipe: "",
    rapport: "NRP",
    observation: "par ERIC BELLON 26/01/2026 17:54 : msg laissé",
    typeInstallation: "ITE",
    smsEnvoye: false,
    smsCount: 0,
    emailEnvoye: true,
    emailCount: 1,
    importedAt: new Date(),
  },
];

export default function LeadsPage() {
  const [leads] = useState<Lead[]>(MOCK_LEADS);
  const [filters, setFilters] = useState<LeadFilters>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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
          lead.nom.toLowerCase().includes(searchLower) ||
          lead.prenom.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.mobile.includes(searchLower) ||
          lead.ref.includes(searchLower)
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
    console.log("Importing file:", file.name);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    alert("Import simulé ! Ton collègue backend implémentera le vrai parsing.");
  };

  const handleSendSMS = (lead: Lead) => {
    console.log("Send SMS to:", lead);
  };

  const handleSendEmail = (lead: Lead) => {
    console.log("Send Email to:", lead);
  };

  const handleViewDetails = (lead: Lead) => {
    console.log("View details:", lead);
  };

  const handleBulkSMS = () => {
    const selected = leads.filter((lead) => selectedIds.includes(lead._id!));
    console.log("Send SMS to selected:", selected);
  };

  const handleBulkEmail = () => {
    const selected = leads.filter((lead) => selectedIds.includes(lead._id!));
    console.log("Send Email to selected:", selected);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Leads NRP</h1>
        <p className="text-text-secondary text-sm md:text-base">
          Gestion et relance des clients Ne Répond Pas
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
