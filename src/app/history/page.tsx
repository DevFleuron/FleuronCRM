"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { useToast } from "@/src/components/contexts/ToastContext";
import { ApiService } from "@/src/lib/api";

interface ImportHistory {
  _id: string;
  nomFichier: string;
  nombreLeads: number;
  nombreSucces: number;
  nombreEchecs: number;
  nombreNouveaux: number;
  nombreMisesAJour: number;
  statut: "en_cours" | "termine" | "erreur";
  erreurs: string[];
  changes: any[];
  processingTime?: number;
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [history, setHistory] = useState<ImportHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getImportHistory();

      if (response.success) {
        setHistory(response.data);
        console.log(`${response.data.length} imports chargés`);
      } else {
        showToast("error", "Erreur", "Impossible de charger l'historique");
      }
    } catch (error: any) {
      console.error("Erreur loadHistory:", error);
      showToast("error", "Erreur", error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "termine":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-success/20 text-success rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Terminé
          </span>
        );
      case "en_cours":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-warning/20 text-warning rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            En cours
          </span>
        );
      case "erreur":
        return (
          <span className="flex items-center gap-1 px-3 py-1 bg-error/20 text-error rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Erreur
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Historique des imports
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Consultez l'historique de tous vos imports CSV ({history.length}{" "}
          imports)
        </p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Total imports</p>
          <p className="text-3xl font-bold">{history.length}</p>
        </div>
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Leads importés</p>
          <p className="text-3xl font-bold text-indigo-400">
            {history.reduce((sum, h) => sum + h.nombreLeads, 0)}
          </p>
        </div>
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Nouveaux</p>
          <p className="text-3xl font-bold text-success">
            {history.reduce((sum, h) => sum + h.nombreNouveaux, 0)}
          </p>
        </div>
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400 mb-1">Mises à jour</p>
          <p className="text-3xl font-bold text-warning">
            {history.reduce((sum, h) => sum + h.nombreMisesAJour, 0)}
          </p>
        </div>
      </div>

      {/* Liste */}
      {history.length === 0 ? (
        <div className="bg-[#111114] border border-slate-800 rounded-2xl p-12 text-center">
          <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">Aucun import pour le moment</p>
          <Button variant="primary" onClick={() => router.push("/leads")}>
            Importer des leads
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => {
            const isExpanded = expandedId === item._id;
            const hasChanges = item.changes && item.changes.length > 0;
            const hasErrors = item.erreurs && item.erreurs.length > 0;

            return (
              <div
                key={item._id}
                className="bg-[#111114] border border-slate-800 rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {item.nomFichier}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(item.createdAt).toLocaleString("fr-FR")}
                          </span>
                          {item.processingTime && (
                            <>
                              <span>•</span>
                              <span>{item.processingTime.toFixed(2)}s</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(item.statut)}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Total</p>
                      <p className="text-xl font-bold">{item.nombreLeads}</p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Nouveaux</p>
                      <p className="text-xl font-bold text-success">
                        {item.nombreNouveaux}
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Mis à jour</p>
                      <p className="text-xl font-bold text-warning">
                        {item.nombreMisesAJour}
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Succès</p>
                      <p className="text-xl font-bold text-success">
                        {item.nombreSucces}
                      </p>
                    </div>
                    <div className="bg-slate-900/50 rounded-lg p-3">
                      <p className="text-xs text-slate-400 mb-1">Échecs</p>
                      <p className="text-xl font-bold text-error">
                        {item.nombreEchecs}
                      </p>
                    </div>
                  </div>

                  {/* Toggle details */}
                  {(hasChanges || hasErrors) && (
                    <button
                      onClick={() => toggleExpand(item._id)}
                      className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Masquer les détails
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Voir les détails
                          {hasChanges &&
                            ` (${item.changes.length} changements)`}
                          {hasErrors && ` (${item.erreurs.length} erreurs)`}
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Details expanded */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-900/30 p-6 space-y-6">
                    {/* Changements */}
                    {hasChanges && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-warning" />
                          Changements détectés ({item.changes.length})
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {item.changes.map((change, index) => (
                            <div
                              key={index}
                              className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-indigo-400">
                                  Lead {change.leadRef}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {new Date(change.timestamp).toLocaleString(
                                    "fr-FR",
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">
                                  {change.field}:
                                </span>
                                <span className="text-error line-through">
                                  {change.oldValue}
                                </span>
                                <span className="text-slate-500">→</span>
                                <span className="text-success">
                                  {change.newValue}
                                </span>
                              </div>
                              {change.action && (
                                <div className="mt-2 pt-2 border-t border-slate-700 text-xs text-slate-500">
                                  Action: {change.action}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Erreurs */}
                    {hasErrors && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-error" />
                          Erreurs ({item.erreurs.length})
                        </h4>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {item.erreurs.map((erreur, index) => (
                            <div
                              key={index}
                              className="bg-error/10 border border-error/30 rounded-lg p-3 text-sm text-error"
                            >
                              {erreur}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
