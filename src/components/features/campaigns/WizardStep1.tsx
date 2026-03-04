"use client";

import React, { useState, useMemo } from "react";
import { Users } from "lucide-react";
import { LeadFiltersBar } from "@/src/components/features/leads/LeadFilters";
import type { Lead, LeadFilters } from "@/src/types";
import { SelectableLeadTable } from "../leads/SelectableLeadTable";
import { getDepartementsFromRegion } from "@/src/lib/regions";

interface WizardStep1Props {
  leads: Lead[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
}

export function WizardStep1({
  leads,
  selectedIds,
  onSelectionChange,
  filters,
  onFiltersChange,
}: WizardStep1Props) {
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
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

      // Autres filtres existants
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
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredLeads.map((lead) => lead._id!));
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-indigo-400">
              {selectedIds.length} destinataire
              {selectedIds.length > 1 ? "s" : ""} sélectionné
              {selectedIds.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-indigo-300/70">
              Filtrez et sélectionnez les leads pour cette campagne
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <LeadFiltersBar
        filters={filters}
        onFiltersChange={onFiltersChange}
        onReset={() => onFiltersChange({})}
        resultsCount={filteredLeads.length}
      />

      {/* Table */}
      <SelectableLeadTable
        leads={filteredLeads}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
      />
    </div>
  );
}
