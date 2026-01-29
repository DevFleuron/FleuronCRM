"use client";

import React from "react";
import { MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LeadRow } from "./LeadRow";
import type { Lead } from "@/types";

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
}: LeadTableProps) {
  const allSelected = leads.length > 0 && selectedIds.length === leads.length;
  const someSelected = selectedIds.length > 0 && !allSelected;

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="card-base flex items-center justify-between">
          <span className="font-semibold">
            {selectedIds.length} lead{selectedIds.length > 1 ? "s" : ""}{" "}
            sélectionné{selectedIds.length > 1 ? "s" : ""}
          </span>
          <div className="flex gap-3">
            <Button variant="primary" size="sm" onClick={onBulkSMS}>
              <MessageSquare className="w-4 h-4" />
              Envoyer SMS
            </Button>
            <Button variant="secondary" size="sm" onClick={onBulkEmail}>
              <Mail className="w-4 h-4" />
              Envoyer Email
            </Button>
          </div>
        </div>
      )}

      <div className="card-base overflow-hidden p-0">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead className="bg-surface-secondary border-b border-border-primary">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={onToggleSelectAll}
                    className="w-4 h-4 rounded border-border-primary bg-surface-primary text-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  />
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase text-text-tertiary tracking-wide">
                  REF
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase text-text-tertiary tracking-wide">
                  Date
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase text-text-tertiary tracking-wide">
                  Nom
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase text-text-tertiary tracking-wide">
                  Mobile
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase text-text-tertiary tracking-wide">
                  Email
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase text-text-tertiary tracking-wide">
                  Rapport
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase text-text-tertiary tracking-wide">
                  Source
                </th>
                <th className="p-4 text-center text-xs font-bold uppercase text-text-tertiary tracking-wide">
                  SMS
                </th>
                <th className="p-4 text-center text-xs font-bold uppercase text-text-tertiary tracking-wide">
                  Email
                </th>
                <th className="p-4 text-left text-xs font-bold uppercase text-text-tertiary tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="p-12 text-center text-text-tertiary"
                  >
                    Aucun lead trouvé
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <LeadRow
                    key={lead._id}
                    lead={lead}
                    isSelected={selectedIds.includes(lead._id!)}
                    onToggleSelect={onToggleSelect}
                    onSendSMS={onSendSMS}
                    onSendEmail={onSendEmail}
                    onViewDetails={onViewDetails}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
