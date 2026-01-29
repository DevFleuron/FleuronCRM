import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: "up" | "down";
  icon: LucideIcon;
  color: "indigo" | "purple" | "emerald" | "blue";
}

export function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: StatsCardProps) {
  const colorClasses = {
    indigo: "bg-indigo-500/10 text-indigo-500",
    purple: "bg-purple-500/10 text-purple-500",
    emerald: "bg-success/10 text-success",
    blue: "bg-info/10 text-info",
  };

  return (
    <div className="card-base card-hover">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl", colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-sm font-medium",
            trend === "up" ? "text-success" : "text-error",
          )}
        >
          {trend === "up" ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {change > 0 ? "+" : ""}
          {change}%
        </div>
      </div>
      <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </div>
  );
}
