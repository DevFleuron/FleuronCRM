"use client";

import React from "react";
import { MessageSquare, Mail, Eye } from "lucide-react";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import type { Lead } from "@/src/types";
import { formatDate, formatPhone, getRapportColor } from "@/src/lib/utils";

interface LeadRowProps {
  lead: Lead;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onSendSMS: (lead: Lead) => void;
  onSendEmail: (lead: Lead) => void;
  onViewDetails: (lead: Lead) => void;
}

export function LeadRow({
  lead,
  isSelected,
  onToggleSelect,
  onSendSMS,
  onSendEmail,
  onViewDetails,
}: LeadRowProps) {
  return (
    <tr className="hover:bg-surface-hover transition-colors border-b border-border-primary">
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(lead._id!)}
          className="w-4 h-4 rounded border-border-primary bg-surface-secondary text-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </td>
      <td className="p-4">
        <span className="font-mono text-sm text-text-secondary">
          {lead.ref}
        </span>
      </td>
      <td className="p-4">
        <span className="text-sm text-text-secondary">
          {formatDate(lead.date)}
        </span>
      </td>
      <td className="p-4">
        <div>
          <div className="font-medium text-text-primary">
            {lead.prenom} {lead.nom}
          </div>
          <div className="text-xs text-text-tertiary">{lead.codePostal}</div>
        </div>
      </td>
      <td className="p-4">
        <span className="text-sm text-text-secondary">
          {formatPhone(lead.mobile)}
        </span>
      </td>
      <td className="p-4">
        <span className="text-sm text-text-secondary truncate max-w-[200px] block">
          {lead.email}
        </span>
      </td>
      <td className="p-4">
        <Badge variant={getRapportColor(lead.rapport)}>{lead.rapport}</Badge>
      </td>
      <td className="p-4">
        <span className="text-xs text-text-tertiary">{lead.source}</span>
      </td>
      <td className="p-4 text-center">
        {lead.smsEnvoye ? (
          <Badge variant="success" className="text-xs">
            {lead.smsCount}x
          </Badge>
        ) : (
          <span className="text-text-tertiary">-</span>
        )}
      </td>
      <td className="p-4 text-center">
        {lead.emailEnvoye ? (
          <Badge variant="success" className="text-xs">
            {lead.emailCount}x
          </Badge>
        ) : (
          <span className="text-text-tertiary">-</span>
        )}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSendSMS(lead)}
            className="p-1.5 hover:bg-brand-primary/10 rounded text-brand-primary transition-colors"
            title="Envoyer SMS"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSendEmail(lead)}
            className="p-1.5 hover:bg-brand-primary/10 rounded text-brand-primary transition-colors"
            title="Envoyer Email"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewDetails(lead)}
            className="p-1.5 hover:bg-surface-hover rounded text-text-secondary transition-colors"
            title="Voir détails"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
