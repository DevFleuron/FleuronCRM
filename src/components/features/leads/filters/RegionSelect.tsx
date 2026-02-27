"use client";

import React from "react";

interface RegionSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const REGIONS = [
  { code: "ile-de-france", nom: "Île-de-France" },
  { code: "auvergne-rhone-alpes", nom: "Auvergne-Rhône-Alpes" },
  { code: "bretagne", nom: "Bretagne" },
  { code: "nouvelle-aquitaine", nom: "Nouvelle-Aquitaine" },
  { code: "occitanie", nom: "Occitanie" },
  { code: "grand-est", nom: "Grand Est" },
  { code: "hauts-de-france", nom: "Hauts-de-France" },
  { code: "normandie", nom: "Normandie" },
  { code: "pays-de-la-loire", nom: "Pays de la Loire" },
  { code: "provence-alpes-cote-azur", nom: "Provence-Alpes-Côte d'Azur" },
  { code: "bourgogne-franche-comte", nom: "Bourgogne-Franche-Comté" },
  { code: "centre-val-de-loire", nom: "Centre-Val de Loire" },
  { code: "corse", nom: "Corse" },
];

export function RegionSelect({ value, onChange }: RegionSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Région
      </label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none"
      >
        <option value="">Toutes les régions</option>
        {REGIONS.map((region) => (
          <option key={region.code} value={region.code}>
            {region.nom}
          </option>
        ))}
      </select>
    </div>
  );
}
