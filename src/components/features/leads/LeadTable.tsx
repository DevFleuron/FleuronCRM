"use client";

import React, { useState } from "react";
import { Edit, Download, Eye } from "lucide-react";
import type { Lead } from "@/src/types";
import { Button } from "@/src/components/ui/Button";
import { useToast } from "@/src/components/contexts/ToastContext";
import { ApiService } from "@/src/lib/api";

interface LeadTableProps {
  leads: Lead[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSendSMS: (lead: Lead) => void;
  onSendEmail: (lead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
  onBulkSMS: () => void;
  onBulkEmail: () => void;
  onEdit: (lead: Lead) => void;
  currentFilters?: any;
}

export function LeadTable({
  leads,
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
      console.error("Erreur export:", error);
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{leads.length} leads</h2>
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
            {leads.map((lead) => (
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
                    <div className="font-medium">{formatDate(lead.date)}</div>
                    <div className="text-xs text-slate-500">{lead.heure}</div>
                  </div>
                </td>
                <td className="py-3">
                  <div>
                    <div className="font-medium">
                      {lead.prenom} {lead.nom}
                    </div>
                    <div className="text-xs text-slate-500">{lead.source}</div>
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
            {/* Header */}
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

            {/* Info */}
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

            {/* Actions */}
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
