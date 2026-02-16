"use client";

import React, { useState } from "react";
import { Search, X, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="h-16 md:h-20 border-b border-border-primary glass-effect sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Mobile: Menu Burger + Search Icon + User Badge */}
      <div className="flex items-center justify-between w-full lg:hidden gap-3">
        <div className="flex items-center gap-3">
          {/* Menu Burger - Mobile only */}
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-text-secondary" />
          </button>

          {/* Search Icon - Opens modal on mobile */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* User Badge - Mobile */}
        <div className="flex items-center gap-2 bg-surface-secondary/40 p-1.5 pr-3 rounded-full border border-border-primary">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold shadow-lg flex-shrink-0">
            KA
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold leading-tight">
              Kevin Abaskaran
            </span>
            <span className="text-[10px] text-text-tertiary leading-tight">
              ADMIN
            </span>
          </div>
        </div>
      </div>

      {/* Desktop: Search Bar + User Badge */}
      <>
        <div className="hidden lg:flex items-center gap-4 bg-surface-secondary/50 px-4 py-2 rounded-xl border border-border-primary flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-tertiary flex-shrink-0" />
          <input
            type="text"
            placeholder="Rechercher une campagne, un template..."
            className="bg-transparent border-none outline-none text-sm w-full text-text-primary placeholder:text-text-tertiary"
          />
        </div>

        <div className="hidden lg:flex items-center gap-3 bg-surface-secondary/40 p-1.5 pr-4 rounded-full border border-border-primary">
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-sm font-bold shadow-lg flex-shrink-0">
            KA
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
      </>

      {/* Mobile Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden animate-fade-in">
          <div className="bg-surface-primary border-b border-border-primary p-4">
            <div className="flex items-center gap-3 bg-surface-secondary px-4 py-3 rounded-xl border border-border-primary">
              <Search className="w-5 h-5 text-text-tertiary flex-shrink-0" />
              <input
                type="text"
                placeholder="Rechercher..."
                autoFocus
                className="bg-transparent border-none outline-none text-base w-full text-text-primary placeholder:text-text-tertiary"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 hover:bg-surface-hover rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsSearchOpen(false)} />
        </div>
      )}
    </header>
  );
}
