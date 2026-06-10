"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LeadFiltersBar } from "@/src/components/features/leads/LeadFilters";
import { LeadTable } from "@/src/components/features/leads/LeadTable";
import { LeadImportModal } from "@/src/components/features/leads/LeadImportModal";
import { useToast } from "@/src/components/contexts/ToastContext";
import type { Lead, LeadFilters } from "@/src/types";
import { ApiService } from "@/src/lib/api";

const PAGE_SIZE = 50;

export default function LeadsPage() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<LeadFilters>({});
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadLeads = useCallback(
    async (currentFilters: LeadFilters, currentPage: number) => {
      try {
        setLoading(true);
        const params: Record<string, string> = {
          page: String(currentPage),
          limit: String(PAGE_SIZE),
        };

        // Mapper les filtres vers les query params attendus par le backend
        if (currentFilters.rapport) params.rapport = currentFilters.rapport;
        if (currentFilters.source) params.source = currentFilters.source;
        if (currentFilters.typeInstallation)
          params.typeInstallation = currentFilters.typeInstallation;
        if (currentFilters.importId) params.importId = currentFilters.importId;
        if (currentFilters.dateFrom) params.dateFrom = currentFilters.dateFrom;
        if (currentFilters.dateTo) params.dateTo = currentFilters.dateTo;
        if (currentFilters.smsEnvoye)
          params.smsEnvoye = currentFilters.smsEnvoye;
        if (currentFilters.emailEnvoye)
          params.emailEnvoye = currentFilters.emailEnvoye;
        if (currentFilters.departement)
          params.departement = currentFilters.departement;
        if (currentFilters.region) params.region = currentFilters.region;
        if (currentFilters.search) params.search = currentFilters.search;

        const response = await ApiService.getLeads(params);
        if (response.success) {
          setLeads(response.data);
          setTotal(response.pagination.total);
          setTotalPages(response.pagination.totalPages);
        } else {
          showToast("error", "Erreur", "Impossible de charger les leads");
        }
      } catch (error) {
        showToast("error", "Erreur", "Erreur lors du chargement des leads");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Rechargement quand les filtres ou la page changent
  useEffect(() => {
    loadLeads(filters, page);
  }, [filters, page]);

  // Réinitialiser la page à 1 quand les filtres changent
  const handleFiltersChange = (newFilters: LeadFilters) => {
    setFilters(newFilters);
    setPage(1);
    setSelectedIds([]);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
    setSelectedIds([]);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map((lead) => lead._id!));
    }
  };

  const handleImport = async (file: File) => {
    try {
      const response = await ApiService.importCSV(file);
      if (response.success) {
        showToast("success", "Import réussi !", response.message);
        // Recharger la page courante avec les filtres actuels
        loadLeads(filters, page);
      } else {
        showToast("error", "Erreur d'import", response.message);
      }
    } catch (error: any) {
      showToast("error", "Erreur", error.message || "Erreur lors de l'import");
    }
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-100">
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
          Gestion et relance des clients ({total} leads)
        </p>
      </div>

      <LeadFiltersBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        onImport={() => setIsImportModalOpen(true)}
        resultsCount={total}
      />

      <LeadTable
        leads={leads}
        loading={loading}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onSendSMS={(lead) =>
          showToast("info", "SMS", `SMS à ${lead.prenom} ${lead.nom}`)
        }
        onSendEmail={(lead) =>
          showToast("info", "Email", `Email à ${lead.prenom} ${lead.nom}`)
        }
        onViewDetails={(lead) => console.log("View details:", lead)}
        onBulkSMS={() =>
          showToast("info", "SMS groupé", `${selectedIds.length} SMS`)
        }
        onBulkEmail={() =>
          showToast("info", "Email groupé", `${selectedIds.length} emails`)
        }
        currentFilters={filters}
        // Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

      <LeadImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
