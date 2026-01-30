"use client";

import React from "react";
import {
  TrendingUp,
  Users,
  Send,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", sms: 400, email: 2400 },
  { name: "Fév", sms: 300, email: 1398 },
  { name: "Mar", sms: 200, email: 9800 },
  { name: "Avr", sms: 278, email: 3908 },
  { name: "Mai", sms: 189, email: 4800 },
  { name: "Jun", sms: 239, email: 3800 },
];

const StatCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
  <div className="bg-[#111114] border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div
        className={`flex items-center gap-1 text-sm font-medium ${trend === "up" ? "text-emerald-500" : "text-rose-500"}`}
      >
        {trend === "up" ? (
          <ArrowUpRight className="w-4 h-4" />
        ) : (
          <ArrowDownRight className="w-4 h-4" />
        )}
        {change}
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header - Stack vertical sur mobile */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Suivi Relances NRP
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Gestion des clients "Ne Répond Pas" et taux de récupération.
          </p>
        </div>
        <button
          onClick={() => router.push("/campaigns/new")}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 w-full lg:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span className="whitespace-nowrap">Nouvelle Relance NRP</span>
        </button>
      </div>

      {/* Stats Cards  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <StatCard
          title="Total Leads NRP"
          value="4,820"
          change="+5.2%"
          trend="up"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Relances SMS"
          value="12,450"
          change="+12.2%"
          trend="up"
          icon={MessageSquare}
          color="purple"
        />
        <StatCard
          title="Relances Email"
          value="8,210"
          change="+2.1%"
          trend="up"
          icon={Send}
          color="indigo"
        />
        <StatCard
          title="Taux de Récupération"
          value="24.8%"
          change="+3.4%"
          trend="up"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Charts & Recent - Stack vertical sur mobile/tablette */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-[#111114] border border-slate-800 p-6 md:p-8 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold">
              Activité des campagnes
            </h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span>Email</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span>SMS</span>
              </div>
            </div>
          </div>
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEmail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSMS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#1f2937"
                />
                <XAxis
                  dataKey="name"
                  stroke="#4b5563"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#4b5563"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111114",
                    borderColor: "#1f2937",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="email"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorEmail)"
                />
                <Area
                  type="monotone"
                  dataKey="sms"
                  stroke="#a855f7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSMS)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-[#111114] border border-slate-800 p-6 md:p-8 rounded-2xl">
          <h2 className="text-lg md:text-xl font-bold mb-6">
            Campagnes récentes
          </h2>
          <div className="space-y-4 md:space-y-6">
            {[
              {
                name: "SMS NRP",
                type: "Email",
                status: "Envoyé",
                date: "Hier, 14:00",
              },
              {
                name: "Rappel ITE",
                type: "SMS",
                status: "En cours",
                date: "Aujourd'hui, 10:30",
              },
              {
                name: "Nouveau Produit",
                type: "Email",
                status: "Planifié",
                date: "Demain, 09:00",
              },
              {
                name: "Feedback Client",
                type: "SMS",
                status: "Envoyé",
                date: "27 Jan, 16:45",
              },
            ].map((campaign, i) => (
              <div
                key={i}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors flex-shrink-0">
                    {campaign.type === "Email" ? (
                      <Send className="w-5 h-5" />
                    ) : (
                      <MessageSquare className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {campaign.name}
                    </p>
                    <p className="text-xs text-slate-500">{campaign.date}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase whitespace-nowrap ml-2 ${
                    campaign.status === "Envoyé"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : campaign.status === "En cours"
                        ? "bg-indigo-500/10 text-indigo-500 animate-pulse"
                        : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/campaigns/history")}
            className="w-full mt-6 md:mt-8 py-3 rounded-xl border border-slate-800 text-slate-400 font-medium hover:bg-white/5 transition-colors text-sm md:text-base"
          >
            Voir tout l'historique
          </button>
        </div>
      </div>
    </div>
  );
}
