"use client";

import React from "react";
import { Edit } from "lucide-react";
import type { Lead } from "@/src/types";

interface SelectableLeadTableProps {
  leads: Lead[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
}

export function SelectableLeadTable({
  leads,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
}: SelectableLeadTableProps) {
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
        <h2 className="text-xl font-bold">{leads.length} leads disponibles</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedIds.length === leads.length && leads.length > 0}
            onChange={onToggleSelectAll}
            className="w-5 h-5 rounded border-slate-600 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          <span className="text-sm text-slate-300">Tout sélectionner</span>
        </label>
      </div>

      {/* Table Desktop */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="hidden lg:block overflow-x-auto max-h-125 overflow-y-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700">
              <tr className="text-left text-sm text-slate-400">
                <th className="pb-3 font-medium w-12"></th>
                <th className="pb-3 font-medium">Référence</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Nom</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Source</th>
                <th className="pb-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="text-sm hover:bg-slate-900/50 transition-colors cursor-pointer"
                  onClick={() => onToggleSelect(lead._id!)}
                >
                  <td className="py-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(lead._id!)}
                      onChange={() => onToggleSelect(lead._id!)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 rounded border-slate-600 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </td>
                  <td className="py-3">
                    <span className="font-medium text-indigo-400">
                      {lead.ref}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="text-xs text-slate-400">
                      {formatDate(lead.date)}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-medium">
                      {lead.prenom} {lead.nom}
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
                    <span className="text-slate-400 text-xs">
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(lead.rapport)}`}
                    >
                      {lead.rapport}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards Mobile */}
      <div className="lg:hidden space-y-3">
        {leads.map((lead) => (
          <label
            key={lead._id}
            className="flex items-start gap-3 bg-slate-900/50 border border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-900 transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(lead._id!)}
              onChange={() => onToggleSelect(lead._id!)}
              className="w-5 h-5 rounded border-slate-600 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20 mt-1"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-medium text-indigo-400 block mb-1">
                    {lead.ref}
                  </span>
                  <span className="text-sm text-slate-400">
                    {formatDate(lead.date)}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(lead.rapport)}`}
                >
                  {lead.rapport}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="font-medium">
                  {lead.prenom} {lead.nom}
                </div>
                <div className="text-slate-400">
                  <div>{lead.mobile}</div>
                  {lead.email && <div>{lead.email}</div>}
                </div>
                <div className="text-slate-500 text-xs">
                  Source: {lead.source}
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </>
  );
}
