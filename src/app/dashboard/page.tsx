'use client'

import React, { useState, useEffect } from 'react'
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Send,
  FileText,
  Upload,
  TrendingUp,
  Mail,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/src/components/ui/Button'
import { useRouter } from 'next/navigation'
import { ApiService } from '@/src/lib/api'
import { useToast } from '@/src/components/contexts/ToastContext'
import { StatsCard } from '@/src/components/features/dashboard/StatsCard'
import { LeadsChart } from '@/src/components/features/dashboard/LeadsChart'
import { StatusDistribution } from '@/src/components/features/dashboard/StatusDistribution'
import { RecentActivity } from '@/src/components/features/dashboard/RecentActivity'

export default function DashboardPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const response = await ApiService.getDashboardStats()

      if (response.success) {
        setStats(response.data)
        console.log('Stats chargées:', response.data)
      } else {
        showToast('error', 'Erreur', 'Impossible de charger les statistiques')
      }
    } catch (error: any) {
      console.error('Erreur loadStats:', error)
      showToast('error', 'Erreur', 'Erreur lors du chargement des statistiques')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return <div className="text-center text-slate-400">Impossible de charger les statistiques</div>
  }

  const {
    overview,
    leadsByStatus,
    campaignStats,
    brevoStats,
    recentCampaigns,
    recentImports,
    leadsEvolution,
  } = stats
  console.log('Overview data:', {
    totalLeadsNRP: overview.totalLeadsNRP,
    leadsRecuperes: overview.leadsRecuperes,
    totalLeads: overview.totalLeads,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-400 text-sm md:text-base">
          Vue d'ensemble de votre activité de relance
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Leads NRP"
          value={overview.totalLeadsNRP ?? 0}
          icon={Users}
          color="warning"
          trend={overview.totalLeadsNRP > 0 ? 'up' : 'neutral'}
          subtitle={`${overview.totalLeads} leads au total`}
        />
        <StatsCard
          title="Leads récupérés"
          value={overview.leadsRecuperes ?? 0}
          icon={TrendingUp}
          color="success"
          trend={overview.leadsRecuperes > 0 ? 'up' : 'neutral'}
          subtitle="Sortis du NRP (30j)"
        />
        <StatsCard
          title="Taux de conversion"
          value={`${overview.conversionRate}%`}
          icon={TrendingUp}
          color="success"
          trend={
            overview.conversionRate > 20 ? 'up' : overview.conversionRate > 10 ? 'neutral' : 'down'
          }
          subtitle="Leads récupérés / NRP"
        />
        <StatsCard
          title="Campagnes envoyées"
          value={overview.totalCampaigns}
          icon={Send}
          color="purple"
          subtitle={`${campaignStats.totalSent} messages envoyés`}
        />
      </div>
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Evolution des leads */}
        <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Évolution des leads</h2>
          <LeadsChart data={leadsEvolution} />
        </div>

        {/* Répartition par statut */}
        <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-4">Répartition par statut</h2>
          <StatusDistribution data={leadsByStatus} />
        </div>
      </div>
      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-2">SMS envoyés</p>
          <p className="text-2xl font-bold text-purple-400">{overview.leadsWithSMS}</p>
          <p className="text-xs text-slate-500 mt-1">
            {overview.totalLeads > 0
              ? `${((overview.leadsWithSMS / overview.totalLeads) * 100).toFixed(1)}% des leads`
              : '0%'}
          </p>
        </div>

        <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-2">Emails envoyés</p>
          <p className="text-2xl font-bold text-indigo-400">{overview.leadsWithEmail}</p>
          <p className="text-xs text-slate-500 mt-1">
            {overview.totalLeads > 0
              ? `${((overview.leadsWithEmail / overview.totalLeads) * 100).toFixed(1)}% des leads`
              : '0%'}
          </p>
        </div>

        <div className="bg-[#111114] border border-slate-800 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-2">Imports réalisés</p>
          <p className="text-2xl font-bold text-success">{overview.totalImports}</p>
          <p className="text-xs text-slate-500 mt-1">Fichiers CSV importés</p>
        </div>
      </div>

      {/* Stats Brevo / Engagement */}
      <div className="bg-[#111114] border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-6">Statistiques brevo</h2>

        {/* Stats Email */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Emails
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Livrés</p>
              <p className="text-2xl font-bold text-indigo-400">{brevoStats.totalEmailDelivered}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Ouverts</p>
              <p className="text-2xl font-bold text-success">{brevoStats.totalEmailOpened}</p>
              <p className="text-xs text-slate-600 mt-1">
                {brevoStats.emailOpenRate}% taux d'ouverture
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Cliqués</p>
              <p className="text-2xl font-bold text-purple-400">{brevoStats.totalEmailClicked}</p>
              <p className="text-xs text-slate-600 mt-1">
                {brevoStats.emailClickRate}% taux de clic
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Bounced</p>
              <p className="text-2xl font-bold text-error">{brevoStats.totalEmailBounced}</p>
            </div>
          </div>
        </div>

        {/* Stats SMS */}
        <div>
          <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            SMS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Livrés</p>
              <p className="text-2xl font-bold text-purple-400">{brevoStats.totalSmsDelivered}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Ouverts</p>
              <p className="text-2xl font-bold text-success">{brevoStats.totalSmsOpened}</p>
              <p className="text-xs text-slate-600 mt-1">
                {brevoStats.smsOpenRate}% taux d'ouverture
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Cliqués</p>
              <p className="text-2xl font-bold text-blue-400">{brevoStats.totalSmsClicked}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Activité récente */}
      <RecentActivity campaigns={recentCampaigns} imports={recentImports} />
    </div>
  )
}
