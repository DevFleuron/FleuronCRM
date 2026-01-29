"use client";

import React from "react";
import { MessageSquare, Mail, Eye, MoreVertical } from "lucide-react";
import { Badge } from "@/src/components/ui/Badge";
import type { Lead } from "@/src/types";
import { formatDate, formatPhone, getRapportColor } from "@/src/lib/utils";

interface LeadCardProps {
  lead: Lead;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onSendSMS: (lead: Lead) => void;
  onSendEmail: (lead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
}

export function LeadCard({
  lead,
  isSelected,
  onToggleSelect,
  onSendSMS,
  onSendEmail,
  onViewDetails,
}: LeadCardProps) {
  return (
    <div className="bg-surface-primary border border-border-primary rounded-xl p-4 hover:border-border-secondary transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(lead._id!)}
          className="mt-1 w-4 h-4 rounded border-border-primary bg-surface-secondary text-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">
                {lead.prenom} {lead.nom}
              </h3>
              <p className="text-xs text-text-tertiary">
                REF: {lead.ref} • {formatDate(lead.date)}
              </p>
            </div>
            <Badge
              variant={getRapportColor(lead.rapport)}
              className="flex-shrink-0"
            >
              {lead.rapport}
            </Badge>
          </div>

          <div className="space-y-1 mb-3">
            <p className="text-sm text-text-secondary">
              {formatPhone(lead.mobile)}
            </p>
            <p className="text-sm text-text-secondary truncate">{lead.email}</p>
            <p className="text-xs text-text-tertiary">
              {lead.codePostal} • {lead.source}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              {lead.smsEnvoye ? (
                <Badge variant="success" className="text-xs">
                  SMS: {lead.smsCount}x
                </Badge>
              ) : (
                <span className="text-text-tertiary">SMS: -</span>
              )}
              {lead.emailEnvoye ? (
                <Badge variant="success" className="text-xs">
                  Email: {lead.emailCount}x
                </Badge>
              ) : (
                <span className="text-text-tertiary">Email: -</span>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onSendSMS(lead)}
                className="p-2 hover:bg-brand-primary/10 rounded-lg text-brand-primary transition-colors"
                title="Envoyer SMS"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSendEmail(lead)}
                className="p-2 hover:bg-brand-primary/10 rounded-lg text-brand-primary transition-colors"
                title="Envoyer Email"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewDetails(lead)}
                className="p-2 hover:bg-surface-hover rounded-lg text-text-secondary transition-colors"
                title="Voir détails"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
