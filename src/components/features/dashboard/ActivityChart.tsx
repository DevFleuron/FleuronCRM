"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ActivityData } from "@/src/types";

interface ActivityChartProps {
  data: ActivityData[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <div className="card-base">
      <h2 className="text-xl font-bold mb-8">Activité des relances</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border-primary)"
            />
            <XAxis
              dataKey="month"
              stroke="var(--color-text-tertiary)"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="var(--color-text-tertiary)"
              fontSize={12}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface-primary)",
                borderColor: "var(--color-border-primary)",
                borderRadius: "0.75rem",
                color: "var(--color-text-primary)",
              }}
              labelStyle={{ color: "var(--color-text-secondary)" }}
            />
            <Area
              type="monotone"
              dataKey="email"
              stroke="var(--color-indigo-500)"
              fill="var(--color-indigo-500)"
              fillOpacity={0.1}
              strokeWidth={3}
              name="Emails"
            />
            <Area
              type="monotone"
              dataKey="sms"
              stroke="var(--color-purple-500)"
              fill="var(--color-purple-500)"
              fillOpacity={0.1}
              strokeWidth={3}
              name="SMS"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
          <span className="text-sm text-text-secondary">Emails</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-sm text-text-secondary">SMS</span>
        </div>
      </div>
    </div>
  );
}
