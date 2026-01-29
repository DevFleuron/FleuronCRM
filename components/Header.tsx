"use client";

import React from "react";
import { Search } from "lucide-react";

export function Header() {
  return (
    <header className="h-20 border-b border-border-primary glass-effect sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4 bg-surface-secondary/50 px-4 py-2 rounded-xl border border-border-primary w-96">
        <Search className="w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          placeholder="Rechercher une campagne, un template..."
          className="bg-transparent border-none outline-none text-sm w-full text-text-primary placeholder:text-text-tertiary"
        />
      </div>

      <div className="flex items-center gap-3 bg-surface-secondary/40 p-1.5 pr-4 rounded-full border border-border-primary">
        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-sm font-bold shadow-lg">
          KS
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight">
            Kevin Abaskaran
          </span>
          <span className="text-xs text-text-tertiary leading-tight">
            ADMIN
          </span>
        </div>
      </div>
    </header>
  );
}
