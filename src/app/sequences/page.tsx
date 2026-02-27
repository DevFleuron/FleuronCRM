"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Play, Pause, Eye } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { useToast } from "@/src/components/contexts/ToastContext";
import { ApiService } from "@/src/lib/api";
import type { SequenceCampaign } from "@/src/types";

export default function SequencesPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [sequences, setSequences] = useState<SequenceCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSequences();
  }, []);

  const loadSequences = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getSequences();

      if (response.success) {
        setSequences(response.data);
        console.log(`${response.data.length} séquences chargées`);
      } else {
        showToast("error", "Erreur", "Impossible de charger les séquences");
      }
    } catch (error: any) {
      console.error("Erreur loadSequences:", error);
      showToast("error", "Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStopSequence = async (id: string, name: string) => {
    if (!confirm(`Voulez-vous vraiment arrêter la séquence "${name}" ?`)) {
      return;
    }

    try {
      const response = await ApiService.stopSequence(id);

      if (response.success) {
        showToast(
          "success",
          "Séquence arrêtée",
          `La séquence "${name}" a été arrêtée`,
        );
        await loadSequences();
      } else {
        showToast("error", "Erreur", response.message);
      }
    } catch (error: any) {
      console.error("Erreur stopSequence:", error);
      showToast("error", "Erreur", error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des séquences...</p>
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
            Séquences automatiques
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Gérez vos campagnes de relance automatisées ({sequences.length}{" "}
            séquences)
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push("/sequences/new")}
          className="w-full lg:w-auto"
        >
          Nouvelle séquence
        </Button>
      </div>

      {/* Liste des séquences */}
      {sequences.length === 0 ? (
        <div className="bg-[#111114] border border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-4">Aucune séquence créée</p>
          <Button
            variant="primary"
            onClick={() => router.push("/sequences/new")}
          >
            <Plus className="w-5 h-5" />
            Créer ma première séquence
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sequences.map((sequence) => (
            <div
              key={sequence._id}
              className="bg-[#111114] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{sequence.name}</h3>
                  <p className="text-sm text-slate-400">
                    Créée le{" "}
                    {new Date(sequence.createdAt!).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    sequence.status === "active"
                      ? "bg-success/20 text-success"
                      : sequence.status === "completed"
                        ? "bg-slate-700 text-slate-400"
                        : "bg-warning/20 text-warning"
                  }`}
                >
                  {sequence.status === "active"
                    ? "Active"
                    : sequence.status === "completed"
                      ? "Terminée"
                      : "Brouillon"}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-1">Total</p>
                  <p className="text-2xl font-bold">
                    {sequence.recipientsCount}
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-1">En cours</p>
                  <p className="text-2xl font-bold text-warning">
                    {sequence.activeCount}
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-1">Terminés</p>
                  <p className="text-2xl font-bold text-success">
                    {sequence.completedCount}
                  </p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className="text-sm text-slate-400 mb-1">Arrêtés</p>
                  <p className="text-2xl font-bold text-error">
                    {sequence.stoppedCount}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push(`/sequences/${sequence._id}`)}
                >
                  <Eye className="w-4 h-4" />
                  Voir détails
                </Button>

                {sequence.status === "active" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      handleStopSequence(sequence._id!, sequence.name)
                    }
                  >
                    <Pause className="w-4 h-4" />
                    Arrêter
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
