"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui/Button";
import { CampaignTable } from "@/src/components/features/campaigns/CampaignTable";
import { CampaignCard } from "@/src/components/features/campaigns/CampaignCard";
import { CampaignDetailsModal } from "@/src/components/features/campaigns/CampaignDetailsModal";
import { useToast } from "@/src/components/contexts/ToastContext";
import { ApiService } from "@/src/lib/api";
import type { Campaign } from "@/src/types";

export default function CampaignHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "sms" | "email">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "sent" | "sending" | "failed"
  >("all");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );

  // Charger les campagnes au montage
  useEffect(() => {
    loadCampaigns();

    // Afficher toast de succès si on vient de créer une campagne
    if (searchParams.get("success") === "true") {
      const name = searchParams.get("name");
      showToast(
        "success",
        "Campagne créée !",
        `La campagne "${name}" a été créée avec succès`,
      );
    }
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getCampaigns();

      if (response.success) {
        setCampaigns(response.data);
        console.log(`${response.data.length} campagnes chargées`);
      } else {
        showToast("error", "Erreur", "Impossible de charger les campagnes");
      }
    } catch (error: any) {
      console.error("Erreur loadCampaigns:", error);
      showToast("error", "Erreur", "Erreur lors du chargement des campagnes");
    } finally {
      setLoading(false);
    }
  };

  // Filtrage
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesType = typeFilter === "all" || campaign.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  // Stats globales
  const stats = {
    totalSent: campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0),
    totalFailed: campaigns.reduce((sum, c) => sum + (c.failedCount || 0), 0),
    totalRecipients: campaigns.reduce(
      (sum, c) => sum + (c.recipientsCount || 0),
      0,
    ),
  };

  const handleViewDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des campagnes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Historique des campagnes
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Suivez l'état de vos campagnes de relance ({campaigns.length}{" "}
            campagnes)
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push("/campaign/new")}
          className="w-full lg:w-auto"
        >
          Nouvelle Relance
        </Button>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-2">Total envoyés</p>
          <p className="text-3xl font-bold text-success">{stats.totalSent}</p>
        </div>
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-2">Total échecs</p>
          <p className="text-3xl font-bold text-error">{stats.totalFailed}</p>
        </div>
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-2">Total destinataires</p>
          <p className="text-3xl font-bold text-indigo-400">
            {stats.totalRecipients}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
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

          {/* Type */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === "all"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setTypeFilter("sms")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === "sms"
                  ? "bg-purple-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              SMS
            </button>
            <button
              onClick={() => setTypeFilter("email")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                typeFilter === "email"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Email
            </button>
          </div>

          {/* Status */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setStatusFilter("sent")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "sent"
                  ? "bg-success text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Envoyés
            </button>
            <button
              onClick={() => setStatusFilter("sending")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "sending"
                  ? "bg-warning text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setStatusFilter("failed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === "failed"
                  ? "bg-error text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Échoués
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          {filteredCampaigns.length} résultat
          {filteredCampaigns.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Liste / Tableau */}
      {filteredCampaigns.length === 0 ? (
        <div className="bg-[#111114] border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400">
            {campaigns.length === 0
              ? "Aucune campagne. Créez-en une pour commencer !"
              : "Aucune campagne trouvée"}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile : Cards */}
          <div className="lg:hidden space-y-4">
            {filteredCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign._id}
                campaign={campaign}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Desktop : Table */}
          <div className="hidden lg:block">
            <CampaignTable
              campaigns={filteredCampaigns}
              onViewDetails={handleViewDetails}
            />
          </div>
        </>
      )}

      {/* Modal détails */}
      {selectedCampaign && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
}
