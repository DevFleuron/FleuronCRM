"use client";

import React from "react";
import { MessageSquare, Mail, Users, Calendar, Eye } from "lucide-react";
import { Badge } from "@/src/components/ui/Badge";
import type { Campaign } from "@/src/types";
import { formatDate } from "@/src/lib/utils";

interface CampaignCardProps {
  campaign: Campaign;
  onViewDetails: (campaign: Campaign) => void;
}

export function CampaignCard({ campaign, onViewDetails }: CampaignCardProps) {
  const getStatusBadge = () => {
    switch (campaign.status) {
      case "sent":
        return <Badge variant="success">Envoyé</Badge>;
      case "sending":
        return <Badge variant="warning">En cours</Badge>;
      case "failed":
        return <Badge variant="error">Échoué</Badge>;
      case "draft":
        return <Badge variant="neutral">Brouillon</Badge>;
      default:
        return null;
    }
  };

  const successRate =
    campaign.sentCount > 0
      ? Math.round((campaign.sentCount / campaign.recipientsCount) * 100)
      : 0;

  return (
    <div className="bg-[#111114] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
              campaign.type === "email"
                ? "bg-indigo-500/10 text-indigo-500"
                : "bg-purple-500/10 text-purple-500"
            }`}
          >
            {campaign.type === "email" ? (
              <Mail className="w-6 h-6" />
            ) : (
              <MessageSquare className="w-6 h-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate">{campaign.name}</h3>
            <p className="text-xs text-slate-500">
              {formatDate(campaign.createdAt || new Date())}
            </p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Destinataires</span>
          <span className="font-semibold">{campaign.recipientsCount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Envoyés</span>
          <span className="font-semibold text-success">
            {campaign.sentCount}
          </span>
        </div>
        {campaign.failedCount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Échecs</span>
            <span className="font-semibold text-error">
              {campaign.failedCount}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Taux de réussite</span>
          <span
            className={`font-semibold ${successRate >= 90 ? "text-success" : successRate >= 70 ? "text-warning" : "text-error"}`}
          >
            {successRate}%
          </span>
        </div>
      </div>

      <button
        onClick={() => onViewDetails(campaign)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
      >
        <Eye className="w-4 h-4" />
        Voir les détails
      </button>
    </div>
  );
}
