"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface StatusDistributionProps {
  data: Array<{ _id: string; count: number }>;
}

const COLORS = {
  NRP: "#6366f1", // Indigo
  "RDV PRIS": "#10b981", // Success
  "DEVIS ENVOYE": "#8b5cf6", // Purple
  GAGNE: "#22c55e", // Green
  PERDU: "#ef4444", // Error
  "EN COURS": "#f59e0b", // Warning
  RAPPEL: "#3b82f6", // Blue
  INJOIGNABLE: "#64748b", // Slate
};

const DEFAULT_COLOR = "#94a3b8";

export function StatusDistribution({ data }: StatusDistributionProps) {
  // Transformer les données pour le graphique
  const chartData = data.map((item) => ({
    name: item._id || "Non défini",
    value: item.count,
    color: COLORS[item._id as keyof typeof COLORS] || DEFAULT_COLOR,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Aucune donnée disponible
      </div>
    );
  }

  // Calculer le total
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: any) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f1f5f9",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Légende personnalisée */}
      <div className="mt-4 space-y-2">
        {chartData.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-300">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">{item.value}</span>
              <span className="text-slate-500 text-xs w-12 text-right">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
