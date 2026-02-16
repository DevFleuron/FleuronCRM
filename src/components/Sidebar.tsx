"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Send,
  FileText,
  History,
  Users,
  Settings,
  ChevronLeft,
  Zap,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/src/lib/utils";

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
    href: "/campaign/new",
  },
  { id: "templates", name: "Modèles NRP", icon: FileText, href: "/templates" },
  {
    id: "campaign-history",
    name: "Historique Relances",
    icon: History,
    href: "/campaign/history",
  },
  { id: "leads", name: "Leads", icon: Users, href: "/leads" },
  {
    id: "sequences",
    name: "Séquences",
    href: "/sequences",
    icon: Zap,
  },
  {
    id: "import-history",
    name: "Historique Imports",
    href: "/history",
    icon: History,
  },
];

interface SidebarProps {
  isMobileMenuOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  isMobileMenuOpen = false,
  onClose = () => {},
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const handleToggle = (e: React.MouseEvent) => {
    // Ne pas toggle si on clique sur un bouton de navigation
    if ((e.target as HTMLElement).closest("button[data-nav-item]")) {
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={onClose}
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
        {/* Header - Cliquable sur desktop */}
        <div
          className="p-6 flex items-center justify-between gap-3 cursor-pointer hover:bg-surface-hover transition-colors hidden lg:flex"
          onClick={handleToggle}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <Send className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <span className="font-bold text-xl bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent uppercase tracking-tight">
                Fleuron CRM
              </span>
            )}
          </div>
          {isOpen && (
            <ChevronLeft className="w-5 h-5 text-text-secondary flex-shrink-0" />
          )}
        </div>

        {/* Header - Non cliquable sur mobile */}
        <div className="p-6 flex items-center gap-3 lg:hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <span className="font-bold text-xl bg-gradient-to-r from-white to-text-secondary bg-clip-text text-transparent uppercase tracking-tight">
              FLeuron CRM
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-2 mt-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href);

            return (
              <button
                key={item.id}
                data-nav-item
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-glow"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && (
                  <span className="font-medium truncate">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="px-3 pb-6">
          <button
            data-nav-item
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-text-secondary hover:bg-surface-hover hover:text-text-primary",
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {isOpen && <span className="font-medium">Paramètres</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
