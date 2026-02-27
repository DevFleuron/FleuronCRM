"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LeadsChartProps {
  data: Array<{ date: string; count: number }>;
}

export function LeadsChart({ data }: LeadsChartProps) {
  // Transformer les données
  const chartData = data.map((item) => ({
    date: item.date, // Utiliser directement la date formatée du backend
    leads: item.count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="date"
          stroke="#94a3b8"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={40}
        />
        <YAxis stroke="#94a3b8" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "8px",
            color: "#f1f5f9",
          }}
        />
        <Line
          type="monotone"
          dataKey="leads"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ fill: "#6366f1" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
