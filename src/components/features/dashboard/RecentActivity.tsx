"use client";

import React from "react";
import { Send, Upload, Clock, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";

interface Campaign {
  _id: string;
  name: string;
  type: "sms" | "email";
  status: string;
  sentCount: number;
  failedCount: number;
  createdAt: string;
}

interface Import {
  _id: string;
  nomFichier: string;
  nombreLeads: number;
  nombreNouveaux: number;
  nombreMisesAJour: number;
  statut: string;
  dateImport: string;
}

interface RecentActivityProps {
  campaigns: Campaign[];
  imports: Import[];
}

export function RecentActivity({ campaigns, imports }: RecentActivityProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "text-success";
      case "sending":
        return "text-warning";
      case "failed":
        return "text-error";
      case "termine":
        return "text-success";
      default:
        return "text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
      case "termine":
        return <CheckCircle className="w-4 h-4" />;
      case "sending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Campagnes récentes */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Campagnes récentes</h2>
          <button
            onClick={() => router.push("/campaign/history")}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Voir tout →
          </button>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Send className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune campagne récente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                onClick={() => router.push(`/campaign/history`)}
                className="flex items-center gap-4 p-4 bg-slate-900/50 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
              >
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    campaign.type === "sms"
                      ? "bg-purple-500/10 text-purple-400"
                      : "bg-indigo-500/10 text-indigo-400",
                  )}
                >
                  <Send className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {campaign.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        campaign.type === "sms"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-indigo-500/10 text-indigo-400",
                      )}
                    >
                      {campaign.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDate(campaign.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm",
                      getStatusColor(campaign.status),
                    )}
                  >
                    {getStatusIcon(campaign.status)}
                    <span className="capitalize">{campaign.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {campaign.sentCount} envoyés
                    {campaign.failedCount > 0 &&
                      `, ${campaign.failedCount} échecs`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Imports récents */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Imports récents</h2>
          <button
            onClick={() => router.push("/history")}
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Voir tout →
          </button>
        </div>

        {imports.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun import récent</p>
          </div>
        ) : (
          <div className="space-y-3">
            {imports.map((importItem) => (
              <div
                key={importItem._id}
                className="flex items-center gap-4 p-4 bg-slate-900/50 hover:bg-slate-900 rounded-lg transition-colors"
              >
                <div className="p-2 rounded-lg bg-success/10 text-success">
                  <Upload className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {importItem.nomFichier}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {formatDate(importItem.dateImport)}
                  </p>
                </div>

                <div className="text-right">
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm",
                      getStatusColor(importItem.statut),
                    )}
                  >
                    {getStatusIcon(importItem.statut)}
                    <span className="capitalize">{importItem.statut}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {importItem.nombreLeads} leads
                  </p>
                  <p className="text-xs text-slate-600">
                    {importItem.nombreNouveaux > 0 &&
                      `${importItem.nombreNouveaux} nouveaux`}
                    {importItem.nombreNouveaux > 0 &&
                      importItem.nombreMisesAJour > 0 &&
                      ", "}
                    {importItem.nombreMisesAJour > 0 &&
                      `${importItem.nombreMisesAJour} MAJ`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
