"use client";

import React from "react";
import { MessageSquare, Mail, Eye } from "lucide-react";
import { Badge } from "@/src/components/ui/Badge";
import type { Campaign } from "@/src/types";
import { formatDate } from "@/src/lib/utils";

interface CampaignTableProps {
  campaigns: Campaign[];
  onViewDetails: (campaign: Campaign) => void;
}

export function CampaignTable({
  campaigns,
  onViewDetails,
}: CampaignTableProps) {
  const getStatusBadge = (status: Campaign["status"]) => {
    switch (status) {
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

  return (
    <div className="bg-[#111114] border border-slate-800 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 border-b border-slate-800">
            <tr>
              <th className="p-4 text-left text-xs font-bold uppercase text-slate-400 tracking-wide">
                Campagne
              </th>
              <th className="p-4 text-left text-xs font-bold uppercase text-slate-400 tracking-wide">
                Type
              </th>
              <th className="p-4 text-left text-xs font-bold uppercase text-slate-400 tracking-wide">
                Statut
              </th>
              <th className="p-4 text-center text-xs font-bold uppercase text-slate-400 tracking-wide">
                Destinataires
              </th>
              <th className="p-4 text-center text-xs font-bold uppercase text-slate-400 tracking-wide">
                Envoyés
              </th>
              <th className="p-4 text-center text-xs font-bold uppercase text-slate-400 tracking-wide">
                Échecs
              </th>
              <th className="p-4 text-center text-xs font-bold uppercase text-slate-400 tracking-wide">
                Taux
              </th>
              <th className="p-4 text-left text-xs font-bold uppercase text-slate-400 tracking-wide">
                Date
              </th>
              <th className="p-4 text-center text-xs font-bold uppercase text-slate-400 tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-12 text-center text-slate-400">
                  Aucune campagne trouvée
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => {
                const successRate =
                  campaign.sentCount > 0
                    ? Math.round(
                        (campaign.sentCount / campaign.recipientsCount) * 100,
                      )
                    : 0;

                return (
                  <tr
                    key={campaign._id}
                    className="border-b border-slate-800 hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-sm">{campaign.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">
                          ID: {campaign._id}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {campaign.type === "email" ? (
                          <Mail className="w-4 h-4 text-indigo-500" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-purple-500" />
                        )}
                        <span className="text-sm capitalize">
                          {campaign.type}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(campaign.status)}</td>
                    <td className="p-4 text-center">
                      <span className="font-semibold">
                        {campaign.recipientsCount}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-success font-semibold">
                        {campaign.sentCount}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={
                          campaign.failedCount > 0
                            ? "text-error font-semibold"
                            : "text-slate-500"
                        }
                      >
                        {campaign.failedCount}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`font-semibold ${
                          successRate >= 90
                            ? "text-success"
                            : successRate >= 70
                              ? "text-warning"
                              : "text-error"
                        }`}
                      >
                        {successRate}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-slate-400">
                        {formatDate(campaign.createdAt || new Date())}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onViewDetails(campaign)}
                        className="p-2 hover:bg-indigo-500/10 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
