"use client";

import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: "indigo" | "purple" | "success" | "error" | "warning" | "blue";
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
}: StatsCardProps) {
  const colorClasses = {
    indigo: "bg-indigo-500/10 text-indigo-400",
    purple: "bg-purple-500/10 text-purple-400",
    success: "bg-success/10 text-success",
    error: "bg-error/10 text-error",
    warning: "bg-warning/10 text-warning",
    blue: "bg-blue-500/10 text-blue-400",
  };

  return (
    <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-lg", colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && trend !== "neutral" && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend === "up" ? "text-success" : "text-error",
            )}
          >
            {trend === "up" ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-slate-400 mb-1">{title}</p>
      <p className="text-3xl font-bold mb-1">{value}</p>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}
