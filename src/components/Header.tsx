"use client";

import React from "react";
import { Menu } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  onMenuClick?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  const initials = user?.name ? getInitials(user.name) : "?";
  const displayName = user?.name || "Utilisateur";
  const displayRole = user?.role === "admin" ? "ADMIN" : "UTILISATEUR";

  return (
    <header className="h-16 md:h-20 border-b border-border-primary glass-effect sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Mobile */}
      <div className="flex items-center justify-between w-full lg:hidden">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-text-secondary" />
        </button>

        <div className="flex items-center gap-2 bg-surface-secondary/40 p-1.5 pr-3 rounded-full border border-border-primary">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold shadow-lg flex-shrink-0">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold leading-tight">
              {displayName}
            </span>
            <span className="text-[10px] text-text-tertiary leading-tight">
              {displayRole}
            </span>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex items-center justify-end w-full">
        <div className="flex items-center gap-3 bg-surface-secondary/40 p-1.5 pr-4 rounded-full border border-border-primary">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">
              {displayName}
            </span>
            <span className="text-xs text-text-tertiary leading-tight">
              {displayRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
