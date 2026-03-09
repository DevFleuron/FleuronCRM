"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Settings, Tag, Database } from "lucide-react";

interface SettingsData {
  rapports: string[];
  sources: string[];
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    rapports: [],
    sources: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"rapports" | "sources">(
    "rapports",
  );
  const [newValue, setNewValue] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newValue.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch(`/api/settings/${activeTab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        return;
      }
      setSettings(data);
      setNewValue("");
    } catch (e) {
      setError("Erreur réseau");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (value: string) => {
    try {
      const res = await fetch(
        `/api/settings/${activeTab}/${encodeURIComponent(value)}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (res.ok) setSettings(data);
    } catch (e) {
      console.error(e);
    }
  };

  const currentList =
    activeTab === "rapports" ? settings.rapports : settings.sources;

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary" />
      </div>
    );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center">
          <Settings className="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="text-sm text-slate-400">
            Gérer les rapports et sources
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            setActiveTab("rapports");
            setNewValue("");
            setError("");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-colors ${
            activeTab === "rapports"
              ? "bg-brand-primary text-white"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          <Tag className="w-4 h-4" />
          Rapports
          <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
            {settings.rapports.length}
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab("sources");
            setNewValue("");
            setError("");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-colors ${
            activeTab === "sources"
              ? "bg-brand-primary text-white"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          <Database className="w-4 h-4" />
          Sources
          <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
            {settings.sources.length}
          </span>
        </button>
      </div>

      {/* Add form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
        <p className="text-sm font-semibold mb-3">
          Ajouter un {activeTab === "rapports" ? "rapport" : "une source"}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder={
              activeTab === "rapports" ? "Ex: RDV CONFIRME" : "Ex: GOOGLE ADS"
            }
            className="flex-1 bg-[#0f1729] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-primary"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newValue.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-indigo-600 disabled:opacity-50 rounded-lg font-semibold text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
        {error && <p className="text-error text-xs mt-2">{error}</p>}
      </div>

      {/* List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <p className="text-sm font-semibold text-slate-400">
            {currentList.length}{" "}
            {activeTab === "rapports" ? "rapports" : "sources"}
          </p>
        </div>
        <div className="divide-y divide-slate-800">
          {currentList.map((item) => (
            <div
              key={item}
              className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-sm font-medium">{item}</span>
              <button
                onClick={() => handleDelete(item)}
                className="p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors text-slate-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
