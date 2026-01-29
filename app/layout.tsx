import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FleuronCRM - Gestion Relances NRP",
  description: "Plateforme de gestion des relances clients NRP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.variable}>
        <div className="min-h-screen custom-scrollbar bg-[#0a0a0c] overflow-hidden">
          <Sidebar />

          <main className="transition-all duration-300 lg:pl-64">
            <Header />
            <div className="p-4 md:p-6 lg:p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
