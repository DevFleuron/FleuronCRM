"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LeadFiltersBar } from "@/src/components/features/leads/LeadFilters";
import { LeadTable } from "@/src/components/features/leads/LeadTable";
import { LeadImportModal } from "@/src/components/features/leads/LeadImportModal";
import { useToast } from "@/src/components/contexts/ToastContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Lead, LeadFilters } from "@/src/types";
import { ApiService } from "@/src/lib/api";

export default function LeadsPage() {
  const { showToast } = useToast();
  const [filters, setFilters] = useState<LeadFilters>({});
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 50,
  });
  const loadLeads = useCallback(
    async (currentPage = 1, currentFilters = filters) => {
      try {
        setLoading(true);
        // Nettoyer les filtres undefined/vides
        const cleanFilters: any = { page: currentPage };
        Object.entries(currentFilters).forEach(([key, val]) => {
          if (val !== undefined && val !== "" && val !== null) {
            cleanFilters[key] = val;
          }
        });
        const response = await ApiService.getLeads(cleanFilters);
        if (response.success) {
          setLeads(response.data);
          setPagination(response.pagination);
        } else {
          showToast("error", "Erreur", "Impossible de charger les leads");
        }
      } catch (error) {
        console.error("Erreur loadLeads:", error);
        showToast("error", "Erreur", "Erreur lors du chargement des leads");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadLeads(1, filters);
    setPage(1);
  }, [filters]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    loadLeads(newPage, filters);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handleImport = async (file: File) => {
    try {
      const response = await ApiService.importCSV(file);
      if (response.success) {
        showToast("success", "Import réussi !", response.message);
        await loadLeads(1, filters);
      } else {
        showToast("error", "Erreur d'import", response.message);
      }
    } catch (error: any) {
      showToast("error", "Erreur", error.message || "Erreur lors de l'import");
    }
  };

  // Génère les numéros de pages à afficher
  const getPageNumbers = () => {
    const delta = 2;
    const range: number[] = [];
    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(pagination.totalPages, page + delta);
      i++
    ) {
      range.push(i);
    }
    if (range[0] > 1) {
      if (range[0] > 2) range.unshift(-1); // ellipsis
      range.unshift(1);
    }
    if (range[range.length - 1] < pagination.totalPages) {
      if (range[range.length - 1] < pagination.totalPages - 1) range.push(-1);
      range.push(pagination.totalPages);
    }
    return range;
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
          Gestion et relance des clients ({pagination.total} leads)
        </p>
      </div>

      <LeadFiltersBar
        filters={filters}
        onFiltersChange={setFilters}
        onReset={handleResetFilters}
        onImport={() => setIsImportModalOpen(true)}
        resultsCount={pagination.total}
      />

      <LeadTable
        leads={leads}
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
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-slate-400">
            Page {page} sur {pagination.totalPages} — {pagination.total} leads
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {getPageNumbers().map((num, idx) =>
              num === -1 ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-slate-500">
                  ...
                </span>
              ) : (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                    num === page
                      ? "bg-brand-primary text-white"
                      : "hover:bg-indigo-600 text-slate-400"
                  }`}
                >
                  {num}
                </button>
              ),
            )}

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === pagination.totalPages}
              className="p-2 rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <LeadImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
