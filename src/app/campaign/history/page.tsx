"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/Button";
import { CampaignTable } from "@/src/components/features/campaigns/CampaignTable";
import { CampaignCard } from "@/src/components/features/campaigns/CampaignCard";
import { CampaignDetailsModal } from "@/src/components/features/campaigns/CampaignDetailsModal";
import type { Campaign } from "@/src/types";

// Données mockées
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    _id: "1",
    name: "Relance NRP Janvier 2026",
    type: "sms",
    templateId: "1",
    recipients: ["1", "2", "3", "4", "5"],
    recipientsCount: 156,
    sentCount: 148,
    failedCount: 8,
    status: "sent",
    sentAt: new Date("2026-01-28T14:30:00"),
    createdAt: new Date("2026-01-28T10:00:00"),
  },
  {
    _id: "2",
    name: "Email de suivi ITE",
    type: "email",
    templateId: "2",
    recipients: ["1", "2", "3"],
    recipientsCount: 89,
    sentCount: 85,
    failedCount: 4,
    status: "sent",
    sentAt: new Date("2026-01-27T09:15:00"),
    createdAt: new Date("2026-01-27T08:00:00"),
  },
  {
    _id: "3",
    name: "Rappel RDV - Février",
    type: "sms",
    templateId: "3",
    recipients: ["1", "2"],
    recipientsCount: 45,
    sentCount: 32,
    failedCount: 0,
    status: "sending",
    createdAt: new Date("2026-01-29T10:30:00"),
  },
  {
    _id: "4",
    name: "Campagne Email Pompe à Chaleur",
    type: "email",
    templateId: "4",
    recipients: ["1", "2", "3", "4"],
    recipientsCount: 234,
    sentCount: 220,
    failedCount: 14,
    status: "sent",
    sentAt: new Date("2026-01-25T16:00:00"),
    createdAt: new Date("2026-01-25T11:00:00"),
  },
  {
    _id: "5",
    name: "Relance NRP - Dernière chance",
    type: "sms",
    templateId: "1",
    recipients: ["1"],
    recipientsCount: 67,
    sentCount: 0,
    failedCount: 67,
    status: "failed",
    createdAt: new Date("2026-01-26T13:00:00"),
  },
  {
    _id: "6",
    name: "Promo Été 2026",
    type: "email",
    templateId: "2",
    recipients: [],
    recipientsCount: 0,
    sentCount: 0,
    failedCount: 0,
    status: "draft",
    scheduledAt: new Date("2026-06-01T09:00:00"),
    createdAt: new Date("2026-01-20T15:00:00"),
  },
];

export default function CampaignHistoryPage() {
  const router = useRouter();
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "sms" | "email">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "sent" | "sending" | "failed" | "draft"
  >("all");

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign._id?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || campaign.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" || campaign.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [campaigns, searchQuery, typeFilter, statusFilter]);

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  // Stats globales
  const totalSent = campaigns.reduce((acc, c) => acc + c.sentCount, 0);
  const totalFailed = campaigns.reduce((acc, c) => acc + c.failedCount, 0);
  const totalRecipients = campaigns.reduce(
    (acc, c) => acc + c.recipientsCount,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Historique des Relances
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Consultez toutes vos campagnes et leurs statistiques
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push("/campaign/new")}
          className="w-full lg:w-auto rounded-xl"
        >
          Nouvelle Relance
        </Button>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-500 mb-1">Total envoyés</p>
          <p className="text-3xl font-bold text-success">
            {totalSent.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-500 mb-1">Total échecs</p>
          <p className="text-3xl font-bold text-error">
            {totalFailed.toLocaleString()}
          </p>
        </div>
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-500 mb-1">Total destinataires</p>
          <p className="text-3xl font-bold text-indigo-400">
            {totalRecipients.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher une campagne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                typeFilter === "all"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Tous ({campaigns.length})
            </button>
            <button
              onClick={() => setTypeFilter("sms")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                typeFilter === "sms"
                  ? "bg-purple-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              SMS ({campaigns.filter((c) => c.type === "sms").length})
            </button>
            <button
              onClick={() => setTypeFilter("email")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                typeFilter === "email"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Email ({campaigns.filter((c) => c.type === "email").length})
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === "all"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setStatusFilter("sent")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === "sent"
                  ? "bg-success text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Envoyés
            </button>
            <button
              onClick={() => setStatusFilter("sending")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === "sending"
                  ? "bg-warning text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setStatusFilter("failed")}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                statusFilter === "failed"
                  ? "bg-error text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Échoués
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-400">
        {filteredCampaigns.length} campagne
        {filteredCampaigns.length > 1 ? "s" : ""} trouvée
        {filteredCampaigns.length > 1 ? "s" : ""}
      </div>

      {/* Mobile: Cards */}
      <div className="block lg:hidden space-y-4">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-[#111114] border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-slate-400">Aucune campagne trouvée</p>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              campaign={campaign}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </div>

      {/* Desktop: Table */}
      <div className="hidden lg:block">
        <CampaignTable
          campaigns={filteredCampaigns}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Details Modal */}
      <CampaignDetailsModal
        campaign={selectedCampaign}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCampaign(null);
        }}
      />
    </div>
  );
}
