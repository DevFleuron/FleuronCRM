"use client";

import { useState } from "react";
import { Sidebar } from "@/src/components/Sidebar";
import { Header } from "@/src/components/Header";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen custom-scrollbar bg-[#0a0a0c] overflow-x-hidden">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="transition-all duration-300 lg:pl-64 w-full">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="p-4 md:p-6 lg:p-8 max-w-full">{children}</div>
      </main>
    </div>
  );
}
