"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  Pause,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { useToast } from "@/src/components/contexts/ToastContext";
import { ApiService } from "@/src/lib/api";
import type { SequenceCampaign, SequenceRecipient } from "@/src/types";

export default function SequenceDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();

  const [sequence, setSequence] = useState<SequenceCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "in_progress" | "completed" | "stopped"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (params.id) {
      loadSequence();
    }
  }, [params.id]);

  const loadSequence = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getSequenceById(params.id as string);

      if (response.success) {
        setSequence(response.data);
        console.log("Séquence chargée:", response.data);
      } else {
        showToast("error", "Erreur", "Impossible de charger la séquence");
        router.push("/sequences");
      }
    } catch (error: any) {
      console.error("Erreur loadSequence:", error);
      showToast("error", "Erreur", error.message);
      router.push("/sequences");
    } finally {
      setLoading(false);
    }
  };

  const handleStopSequence = async () => {
    if (!sequence) return;

    if (
      !confirm(`Voulez-vous vraiment arrêter la séquence "${sequence.name}" ?`)
    ) {
      return;
    }

    try {
      const response = await ApiService.stopSequence(sequence._id!);

      if (response.success) {
        showToast("success", "Séquence arrêtée", "La séquence a été arrêtée");
        await loadSequence();
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
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!sequence) {
    return null;
  }

  // Filtrage des recipients
  const filteredRecipients = sequence.recipients.filter((recipient) => {
    const matchesFilter = filter === "all" || recipient.status === filter;
    const matchesSearch =
      searchQuery === "" ||
      recipient.leadRef.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-xs font-medium">
            En attente
          </span>
        );
      case "in_progress":
        return (
          <span className="px-2 py-1 bg-warning/20 text-warning rounded text-xs font-medium">
            En cours
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 bg-success/20 text-success rounded text-xs font-medium">
            Terminé
          </span>
        );
      case "stopped":
        return (
          <span className="px-2 py-1 bg-error/20 text-error rounded text-xs font-medium">
            Arrêté
          </span>
        );
      default:
        return null;
    }
  };

  const getStepIcon = (type: string) => {
    return type === "sms" ? (
      <MessageSquare className="w-4 h-4 text-purple-400" />
    ) : (
      <Mail className="w-4 h-4 text-indigo-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-start">
        <div className="flex items-start gap-4">
          <Button variant="secondary" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {sequence.name}
            </h1>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>
                Créée le{" "}
                {new Date(sequence.createdAt!).toLocaleDateString("fr-FR")}
              </span>
              <span>•</span>
              <span
                className={`font-medium ${
                  sequence.status === "active"
                    ? "text-success"
                    : sequence.status === "completed"
                      ? "text-slate-400"
                      : "text-warning"
                }`}
              >
                {sequence.status === "active"
                  ? "Active"
                  : sequence.status === "completed"
                    ? "Terminée"
                    : "Brouillon"}
              </span>
            </div>
          </div>
        </div>

        {sequence.status === "active" && (
          <Button variant="secondary" onClick={handleStopSequence}>
            <Pause className="w-4 h-4" />
            Arrêter la séquence
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Total</p>
          <p className="text-3xl font-bold">{sequence.recipientsCount}</p>
        </div>
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">En cours</p>
          <p className="text-3xl font-bold text-warning">
            {sequence.activeCount}
          </p>
        </div>
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Terminés</p>
          <p className="text-3xl font-bold text-success">
            {sequence.completedCount}
          </p>
        </div>
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Arrêtés</p>
          <p className="text-3xl font-bold text-error">
            {sequence.stoppedCount}
          </p>
        </div>
      </div>

      {/* Configuration des étapes */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Configuration de la séquence</h2>
        <div className="space-y-3">
          {sequence.steps.map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-slate-900/50 border border-slate-700 rounded-lg p-4"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm">
                {step.stepNumber}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getStepIcon(step.type)}
                  <span className="font-medium">
                    {step.type === "sms" ? "SMS" : "Email"}
                    {index > 0 &&
                      ` - ${step.delayDays} jours après l'étape ${index}`}
                  </span>
                </div>
                <p className="text-sm text-slate-400">
                  Template: {(step.templateId as any)?.name || "Non défini"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des recipients */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">
          Leads ({filteredRecipients.length})
        </h2>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par référence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilter("in_progress")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "in_progress"
                  ? "bg-warning text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              En cours
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "completed"
                  ? "bg-success text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Terminés
            </button>
            <button
              onClick={() => setFilter("stopped")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === "stopped"
                  ? "bg-error text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Arrêtés
            </button>
          </div>
        </div>

        {/* Table desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700">
              <tr className="text-left text-sm text-slate-400">
                <th className="pb-3 font-medium">Référence</th>
                <th className="pb-3 font-medium">Nom</th>
                <th className="pb-3 font-medium">Statut</th>
                <th className="pb-3 font-medium">Étape actuelle</th>
                <th className="pb-3 font-medium">Prochaine action</th>
                <th className="pb-3 font-medium">Actions réussies</th>
                <th className="pb-3 font-medium">Raison arrêt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRecipients.map((recipient) => {
                const lead = recipient.leadId as any;
                return (
                  <tr key={recipient.leadId as any} className="text-sm">
                    <td className="py-3">
                      <span className="font-medium">{recipient.leadRef}</span>
                    </td>
                    <td className="py-3">
                      <span className="font-medium">
                        {lead?.prenom} {lead?.nom}
                      </span>
                    </td>
                    <td className="py-3">{getStatusBadge(recipient.status)}</td>
                    <td className="py-3">
                      {recipient.currentStep > 0
                        ? `${recipient.currentStep}/${sequence.steps.length}`
                        : "Pas démarré"}
                    </td>
                    <td className="py-3 text-slate-400">
                      {recipient.nextActionAt
                        ? new Date(recipient.nextActionAt).toLocaleString(
                            "fr-FR",
                          )
                        : "-"}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-success">
                          {
                            recipient.stepsCompleted.filter((s) => s.success)
                              .length
                          }
                        </span>
                        {recipient.stepsCompleted.some((s) => !s.success) && (
                          <span className="text-error">
                            (
                            {
                              recipient.stepsCompleted.filter((s) => !s.success)
                                .length
                            }{" "}
                            échecs)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-slate-400">
                      {recipient.stopReason || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Cards mobile */}
        <div className="md:hidden space-y-3">
          {filteredRecipients.map((recipient) => (
            <div
              key={recipient.leadId as any}
              className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">{recipient.leadRef}</span>
                {getStatusBadge(recipient.status)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Étape</span>
                  <span>
                    {recipient.currentStep > 0
                      ? `${recipient.currentStep}/${sequence.steps.length}`
                      : "Pas démarré"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Prochaine action</span>
                  <span>
                    {recipient.nextActionAt
                      ? new Date(recipient.nextActionAt).toLocaleDateString(
                          "fr-FR",
                        )
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Réussies</span>
                  <span className="text-success">
                    {recipient.stepsCompleted.filter((s) => s.success).length}
                  </span>
                </div>
                {recipient.stopReason && (
                  <div className="pt-2 border-t border-slate-700">
                    <span className="text-slate-400 text-xs">
                      {recipient.stopReason}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredRecipients.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            Aucun lead trouvé
          </div>
        )}
      </div>
    </div>
  );
}
