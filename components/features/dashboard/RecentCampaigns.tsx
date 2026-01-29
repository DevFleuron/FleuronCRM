"use client";

import React from "react";
import { MessageSquare, Mail } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { RecentCampaign } from "@/types";

interface RecentCampaignsProps {
  campaigns: RecentCampaign[];
}

export function RecentCampaigns({ campaigns }: RecentCampaignsProps) {
  return (
    <div className="card-base">
      <h2 className="text-xl font-bold mb-6">Campagnes récentes</h2>
      <div className="space-y-4">
        {campaigns.length === 0 ? (
          <p className="text-center text-text-tertiary py-8">
            Aucune campagne récente
          </p>
        ) : (
          campaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    campaign.type === "email"
                      ? "bg-indigo-500/10 text-indigo-500"
                      : "bg-purple-500/10 text-purple-500"
                  }`}
                >
                  {campaign.type === "email" ? (
                    <Mail className="w-5 h-5" />
                  ) : (
                    <MessageSquare className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {campaign.name}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {campaign.recipientsCount} destinataires •{" "}
                    {formatDate(campaign.sentAt)}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  campaign.status === "sent"
                    ? "success"
                    : campaign.status === "sending"
                      ? "warning"
                      : "neutral"
                }
              >
                {campaign.status === "sent"
                  ? "Envoyé"
                  : campaign.status === "sending"
                    ? "En cours"
                    : "Brouillon"}
              </Badge>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
