"use client";

import React from "react";
import {
  X,
  MessageSquare,
  Mail,
  Users,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Badge } from "@/src/components/ui/Badge";
import type { Campaign } from "@/src/types";
import { formatDate } from "@/src/lib/utils";

interface CampaignDetailsModalProps {
  campaign: Campaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CampaignDetailsModal({
  campaign,
  isOpen,
  onClose,
}: CampaignDetailsModalProps) {
  if (!isOpen || !campaign) return null;

  const successRate =
    campaign.sentCount > 0
      ? Math.round((campaign.sentCount / campaign.recipientsCount) * 100)
      : 0;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl bg-[#111114] border border-slate-800 rounded-2xl animate-slide-in max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-[#111114] border-b border-slate-800 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
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
            <div>
              <h2 className="text-xl font-bold">{campaign.name}</h2>
              <p className="text-sm text-slate-400">
                {campaign.type === "email" ? "Campagne Email" : "Campagne SMS"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Statut</p>
              {getStatusBadge()}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Date de création</p>
              <p className="text-sm font-semibold">
                {formatDate(campaign.createdAt || new Date())}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-lg font-bold mb-4">Statistiques</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <Users className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">{campaign.recipientsCount}</p>
                <p className="text-xs text-slate-500">Destinataires</p>
              </div>

              <div className="bg-slate-900 border border-success/20 rounded-xl p-4 text-center">
                <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-success">
                  {campaign.sentCount}
                </p>
                <p className="text-xs text-slate-500">Envoyés</p>
              </div>

              <div className="bg-slate-900 border border-error/20 rounded-xl p-4 text-center">
                <XCircle className="w-6 h-6 text-error mx-auto mb-2" />
                <p className="text-2xl font-bold text-error">
                  {campaign.failedCount}
                </p>
                <p className="text-xs text-slate-500">Échecs</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
                <div className="w-6 h-6 text-indigo-400 mx-auto mb-2 font-bold text-lg">
                  %
                </div>
                <p
                  className={`text-2xl font-bold ${
                    successRate >= 90
                      ? "text-success"
                      : successRate >= 70
                        ? "text-warning"
                        : "text-error"
                  }`}
                >
                  {successRate}%
                </p>
                <p className="text-xs text-slate-500">Taux de réussite</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold">Progression</p>
              <p className="text-xs text-slate-500">
                {campaign.sentCount + campaign.failedCount} /{" "}
                {campaign.recipientsCount}
              </p>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full flex">
                <div
                  className="bg-success"
                  style={{
                    width: `${(campaign.sentCount / campaign.recipientsCount) * 100}%`,
                  }}
                />
                <div
                  className="bg-error"
                  style={{
                    width: `${(campaign.failedCount / campaign.recipientsCount) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          {campaign.scheduledAt && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-400" />
                <div>
                  <p className="text-sm font-semibold text-indigo-400">
                    Planifié
                  </p>
                  <p className="text-xs text-indigo-300/70">
                    Envoi prévu le {formatDate(campaign.scheduledAt)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {campaign.sentAt && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm font-semibold text-success">Envoyé</p>
                  <p className="text-xs text-success/70">
                    Campagne envoyée le {formatDate(campaign.sentAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#111114] border-t border-slate-800 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
