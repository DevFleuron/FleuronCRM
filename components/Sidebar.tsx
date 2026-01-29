"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Send,
  FileText,
  History,
  Users,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  {
    id: "dashboard",
    name: "Dashboard NRP",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "campaign",
    name: "Nouvelle Relance",
    icon: Send,
    href: "/campaigns/new",
  },
  { id: "templates", name: "Modèles NRP", icon: FileText, href: "/templates" },
  {
    id: "history",
    name: "Historique Relances",
    icon: History,
    href: "/campaigns/history",
  },
  { id: "leads", name: "Fichier NRP", icon: Users, href: "/leads" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface-primary border border-border-primary rounded-lg"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-surface-primary border-r border-border-primary transition-all duration-300 z-50 flex flex-col",
          "lg:translate-x-0",
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
          isOpen ? "w-64" : "w-20",
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <span className="font-bold text-xl bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent uppercase tracking-tight">
              Fleuron HUB
            </span>
          )}
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href);

            return (
              <button
                key={item.id}
                onClick={() => {
                  router.push(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-glow"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
                )}
              >
                <Icon className="w-5 h-5" />
                {isOpen && <span className="font-medium">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-3 pb-6">
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-text-secondary hover:bg-surface-hover hover:text-text-primary",
            )}
          >
            <Settings className="w-5 h-5" />
            {isOpen && <span className="font-medium">Paramètres</span>}
          </button>
        </div>

        {/* Collapse button - Hidden on mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden lg:flex absolute bottom-24 left-1/2 -translate-x-1/2 w-10 h-10 bg-surface-secondary hover:bg-border-primary rounded-lg items-center justify-center transition-colors"
        >
          <div className={cn("transition-transform", !isOpen && "rotate-180")}>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </button>
      </aside>
    </>
  );
}
