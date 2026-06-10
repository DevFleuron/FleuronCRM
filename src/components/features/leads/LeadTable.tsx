"use client";

import React, { useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import type { Lead } from "@/src/types";
import { Button } from "@/src/components/ui/Button";
import { useToast } from "@/src/components/contexts/ToastContext";
import { ApiService } from "@/src/lib/api";

interface LeadTableProps {
  leads: Lead[];
  loading?: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSendSMS: (lead: Lead) => void;
  onSendEmail: (lead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
  onBulkSMS: () => void;
  onBulkEmail: () => void;
  onEdit?: (lead: Lead) => void;
  currentFilters?: any;
  // Pagination
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function LeadTable({
  leads,
  loading = false,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onSendSMS,
  onSendEmail,
  onViewDetails,
  onBulkSMS,
  onBulkEmail,
  onEdit,
  currentFilters,
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
}: LeadTableProps) {
  const { showToast } = useToast();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState<{
    ref: string;
    observation: string;
  } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: "csv" | "excel") => {
    try {
      setIsExporting(true);
      if (format === "csv") {
        await ApiService.exportLeadsCSV(currentFilters);
        showToast("success", "Export réussi", "Fichier CSV téléchargé");
      } else {
        await ApiService.exportLeadsExcel(currentFilters);
        showToast("success", "Export réussi", "Fichier Excel téléchargé");
      }
      setShowExportModal(false);
    } catch (error: any) {
      showToast("error", "Erreur", error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewObservation = (ref: string, observation: string) => {
    setSelectedObservation({ ref, observation });
    setShowObservationModal(true);
  };

  const getStatusColor = (rapport: string) => {
    switch (rapport) {
      case "NRP":
      case "NRP 1":
      case "NRP 2":
      case "NRP 3":
      case "NRP 4":
      case "NRP 5":
        return "bg-warning/20 text-warning";
      case "RDV PRIS":
        return "bg-success/20 text-success";
      case "DEVIS ENVOYE":
        return "bg-indigo-500/20 text-indigo-400";
      case "CLIENT":
        return "bg-success/20 text-success";
      case "PERDU":
        return "bg-error/20 text-error";
      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

  // Calcul plage affichée
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          {loading ? (
            <span className="text-slate-400">Chargement...</span>
          ) : (
            `${leads.length} leads affichés`
          )}
        </h2>
      </div>

      {/* Table Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-700">
            <tr className="text-left text-sm text-slate-400">
              <th className="pb-3 font-medium">Référence</th>
              <th className="pb-3 font-medium">Date/Heure</th>
              <th className="pb-3 font-medium">Nom</th>
              <th className="pb-3 font-medium">Contact</th>
              <th className="pb-3 font-medium">Téléprospecteur</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Statut</th>
              <th className="pb-3 font-medium">Observation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading
              ? // Skeleton rows
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="py-3">
                        <div className="h-4 bg-slate-800 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              : leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="text-sm hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="py-3">
                      <span className="font-medium text-indigo-400">
                        {lead.ref}
                      </span>
                    </td>
                    <td className="py-3">
                      <div>
                        <div className="font-medium">
                          {formatDate(lead.date)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {lead.heure}
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        <div className="font-medium">
                          {lead.prenom} {lead.nom}
                        </div>
                        <div className="text-xs text-slate-500">
                          {lead.source}
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="text-xs">
                        <div className="text-slate-300">{lead.mobile}</div>
                        {lead.email && (
                          <div className="text-slate-500">{lead.email}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        <div className="font-medium text-slate-300">
                          {lead.telepro || "-"}
                        </div>
                        {lead.equipe && (
                          <div className="text-xs text-slate-500">
                            {lead.equipe}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-slate-400 text-xs">
                        {lead.typeInstallation || "-"}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(lead.rapport)}`}
                      >
                        {lead.rapport}
                      </span>
                    </td>
                    <td className="py-3">
                      {lead.observation ? (
                        <button
                          onClick={() =>
                            handleViewObservation(lead.ref, lead.observation!)
                          }
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                          title="Voir l'observation"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="lg:hidden space-y-3">
        {leads.map((lead) => (
          <div
            key={lead._id}
            className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="font-medium text-indigo-400 block mb-1">
                  {lead.ref}
                </span>
                <span className="text-sm text-slate-400">
                  {formatDate(lead.date)} à {lead.heure}
                </span>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(lead.rapport)}`}
              >
                {lead.rapport}
              </span>
            </div>
            <div className="space-y-2 text-sm mb-3">
              <div>
                <span className="font-medium">
                  {lead.prenom} {lead.nom}
                </span>
              </div>
              <div className="text-slate-400">
                <div>{lead.mobile}</div>
                {lead.email && <div>{lead.email}</div>}
              </div>
              {lead.telepro && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Téléprospecteur:</span>
                  <span className="text-slate-300">{lead.telepro}</span>
                </div>
              )}
              {lead.typeInstallation && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Type:</span>
                  <span className="text-slate-300">
                    {lead.typeInstallation}
                  </span>
                </div>
              )}
              <div className="text-slate-500 text-xs">
                Source: {lead.source}
              </div>
            </div>
            <div className="flex gap-2 pt-3 border-t border-slate-700">
              {lead.observation && (
                <button
                  onClick={() =>
                    handleViewObservation(lead.ref, lead.observation!)
                  }
                  className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-indigo-400 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Observation
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-sm text-slate-400">
            {from}–{to} sur {total} leads
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1 || loading}
              className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Pages numérotées */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                    acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-1 text-slate-500 text-sm"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => onPageChange(p as number)}
                      disabled={loading}
                      className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                        p === page
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages || loading}
              className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Observation */}
      {showObservationModal && selectedObservation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6 max-w-2xl w-full">
            <h3 className="text-xl font-bold mb-2">
              Observation - {selectedObservation.ref}
            </h3>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-6">
              <p className="text-slate-300 whitespace-pre-wrap">
                {selectedObservation.observation}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setShowObservationModal(false)}
              className="w-full"
            >
              Fermer
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
