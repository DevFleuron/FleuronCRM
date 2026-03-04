"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Search, X, Filter, Upload } from "lucide-react";
import { Select } from "@/src/components/ui/Select";
import { DepartementSelect } from "./filters/DepartementSelect";
import { RegionSelect } from "./filters/RegionSelect";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/utils";
import type { LeadFilters } from "@/src/types";
import {
  RAPPORT_OPTIONS,
  SOURCE_OPTIONS,
  TYPE_INSTALLATION_OPTIONS,
  SMS_EMAIL_OPTIONS,
} from "@/src/lib/constants";
import { ApiService } from "@/src/lib/api";

interface LeadFiltersProps {
  filters: LeadFilters;
  onFiltersChange: (filters: LeadFilters) => void;
  onReset: () => void;
  onImport?: () => void;
  resultsCount: number;
}

export function LeadFiltersBar({
  filters,
  onFiltersChange,
  onReset,
  onImport,
  resultsCount,
}: LeadFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [imports, setImports] = useState<{ _id: string; nomFichier: string }[]>(
    [],
  );

  useEffect(() => {
    ApiService.getImportHistory().then((res) => {
      if (res.success) setImports(res.data);
    });
  }, []);

  const handleFilterChange = (key: keyof LeadFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value !== "all" && value !== "",
  );

  return (
    <div className="card-base space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-bold">Filtres</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full">
              Actifs
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-secondary">
            {resultsCount} résultat{resultsCount > 1 ? "s" : ""}
          </span>
          {onImport && (
            <Button variant="secondary" size="sm" onClick={onImport}>
              <Upload className="w-4 h-4" />
              Importer CSV
            </Button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <svg
              className={cn(
                "w-5 h-5 transition-transform",
                isExpanded && "rotate-180",
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-border-primary animate-slide-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Rapport"
              value={filters.rapport || ""}
              onChange={(e) => handleFilterChange("rapport", e.target.value)}
              options={RAPPORT_OPTIONS.map((opt) => ({
                value: opt.value,
                label: opt.label,
              }))}
            />
            <Select
              label="Source"
              value={filters.source || ""}
              onChange={(e) => handleFilterChange("source", e.target.value)}
              options={[
                { value: "", label: "Toutes les sources" },
                ...SOURCE_OPTIONS.map((s) => ({ value: s, label: s })),
              ]}
            />
            <Select
              label="Fichier d'import"
              value={filters.importId || ""}
              onChange={(e) => handleFilterChange("importId", e.target.value)}
              options={[
                { value: "", label: "Tous les fichiers" },
                ...imports.map((i) => ({ value: i._id, label: i.nomFichier })),
              ]}
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">
                  Du
                </label>
                <input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                  className="input-base"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wide mb-2">
                  Au
                </label>
                <input
                  type="date"
                  value={filters.dateTo || ""}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className="input-base"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Type Installation"
              value={filters.typeInstallation || ""}
              onChange={(e) =>
                handleFilterChange("typeInstallation", e.target.value)
              }
              options={[
                { value: "", label: "Tous les types" },
                ...TYPE_INSTALLATION_OPTIONS.map((t) => ({
                  value: t,
                  label: t,
                })),
              ]}
            />
            <Select
              label="SMS Envoyé"
              value={filters.smsEnvoye || "all"}
              onChange={(e) => handleFilterChange("smsEnvoye", e.target.value)}
              options={SMS_EMAIL_OPTIONS}
            />
            <Select
              label="Email Envoyé"
              value={filters.emailEnvoye || "all"}
              onChange={(e) =>
                handleFilterChange("emailEnvoye", e.target.value)
              }
              options={SMS_EMAIL_OPTIONS}
            />
            <div className="grid grid-cols-2 gap-2">
              <DepartementSelect
                value={filters.departement || ""}
                onChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    departement: value || undefined,
                  })
                }
              />
              <RegionSelect
                value={filters.region || ""}
                onChange={(value) =>
                  onFiltersChange({ ...filters, region: value || undefined })
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-border-primary">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, email, téléphone, REF..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="input-base pl-10"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={onReset}
              disabled={!hasActiveFilters}
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
