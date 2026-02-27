'use client'

import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  Users,
  Send,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ApiService } from '@/src/lib/api'

const data = [
  { name: 'Jan', sms: 400, email: 2400 },
  { name: 'Fév', sms: 300, email: 1398 },
  { name: 'Mar', sms: 200, email: 9800 },
  { name: 'Avr', sms: 278, email: 3908 },
  { name: 'Mai', sms: 189, email: 4800 },
  { name: 'Jun', sms: 239, email: 3800 },
]

const StatCard = ({ title, value, change, trend, icon: Icon, color }: any) => (
  <div className="bg-[#111114] border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div
        className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div
        className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}
      >
        {trend === 'up' ? (
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
)

export default function DashboardPage() {
  const router = useRouter()

  // États pour les Leads NRP
  const [leadsCount, setLeadsCount] = useState<number>(0)
  const [previousLeadsCount, setPreviousLeadsCount] = useState<number>(0)
  const [leadsChange, setLeadsChange] = useState<string>('0%')
  const [leadsTrend, setLeadsTrend] = useState<'up' | 'down'>('up')

  // États pour les SMS
  const [smsCount, setSmsCount] = useState<number>(0)
  const [smsChange, setSmsChange] = useState<string>('0%')
  const [smsTrend, setSmsTrend] = useState<'up' | 'down'>('up')

  // États pour les Emails
  const [emailCount, setEmailCount] = useState<number>(0)
  const [emailChange, setEmailChange] = useState<string>('0%')
  const [emailTrend, setEmailTrend] = useState<'up' | 'down'>('up')

  // États pour le Taux de Conversion NRP → DEVIS ENVOYE
  const [conversionRate, setConversionRate] = useState<string>('0%')
  const [conversionChange, setConversionChange] = useState<string>('0%')
  const [conversionTrend, setConversionTrend] = useState<'up' | 'down'>('up')

  const [loading, setLoading] = useState(true)

  // Charger le nombre de leads au montage
  useEffect(() => {
    loadLeadsCount()
  }, [])

  // Fonction pour charger le nombre de leads
  const loadLeadsCount = async () => {
    try {
      setLoading(true)
      const response = await ApiService.getLeads()

      if (response.success) {
        const leads = response.data
        const currentCount = leads.length

        // Calculer le nombre de SMS et Emails envoyés
        const currentSmsCount = leads.filter((lead: any) => lead.smsEnvoye === true).length
        const currentEmailCount = leads.filter((lead: any) => lead.emailEnvoye === true).length

        // ===== LEADS NRP =====
        const storedPreviousCount = localStorage.getItem('previousLeadsCount')
        const previousCount = storedPreviousCount ? parseInt(storedPreviousCount) : currentCount

        let leadsChangePercent = 0
        let leadsTrendValue: 'up' | 'down' = 'up'

        if (previousCount > 0 && currentCount !== previousCount) {
          leadsChangePercent = ((currentCount - previousCount) / previousCount) * 100
          leadsTrendValue = leadsChangePercent >= 0 ? 'up' : 'down'
        }

        setLeadsCount(currentCount)
        setPreviousLeadsCount(previousCount)
        setLeadsChange(`${leadsChangePercent >= 0 ? '+' : ''}${leadsChangePercent.toFixed(1)}%`)
        setLeadsTrend(leadsTrendValue)
        localStorage.setItem('previousLeadsCount', currentCount.toString())

        // ===== SMS =====
        const storedPreviousSms = localStorage.getItem('previousSmsCount')
        const previousSmsCount = storedPreviousSms ? parseInt(storedPreviousSms) : currentSmsCount

        let smsChangePercent = 0
        let smsTrendValue: 'up' | 'down' = 'up'

        if (previousSmsCount > 0 && currentSmsCount !== previousSmsCount) {
          smsChangePercent = ((currentSmsCount - previousSmsCount) / previousSmsCount) * 100
          smsTrendValue = smsChangePercent >= 0 ? 'up' : 'down'
        }

        setSmsCount(currentSmsCount)
        setSmsChange(`${smsChangePercent >= 0 ? '+' : ''}${smsChangePercent.toFixed(1)}%`)
        setSmsTrend(smsTrendValue)
        localStorage.setItem('previousSmsCount', currentSmsCount.toString())

        // ===== EMAILS =====
        const storedPreviousEmail = localStorage.getItem('previousEmailCount')
        const previousEmailCount = storedPreviousEmail
          ? parseInt(storedPreviousEmail)
          : currentEmailCount

        let emailChangePercent = 0
        let emailTrendValue: 'up' | 'down' = 'up'

        if (previousEmailCount > 0 && currentEmailCount !== previousEmailCount) {
          emailChangePercent = ((currentEmailCount - previousEmailCount) / previousEmailCount) * 100
          emailTrendValue = emailChangePercent >= 0 ? 'up' : 'down'
        }

        setEmailCount(currentEmailCount)
        setEmailChange(`${emailChangePercent >= 0 ? '+' : ''}${emailChangePercent.toFixed(1)}%`)
        setEmailTrend(emailTrendValue)
        localStorage.setItem('previousEmailCount', currentEmailCount.toString())

        // ===== TAUX DE CONVERSION NRP → DEVIS ENVOYE =====
        // Compter les leads NRP
        const nrpLeadsCount = leads.filter((lead: any) => lead.rapport === 'NRP').length
        // Compter les leads DEVIS ENVOYE (qui étaient potentiellement NRP avant)
        const devisEnvoyeCount = leads.filter((lead: any) => lead.rapport === 'DEVIS ENVOYE').length

        // Calculer le taux de conversion
        // Formule: (Devis Envoyé / (NRP + Devis Envoyé)) × 100
        // Cela représente le % de leads qui sont passés de NRP à Devis parmi tous les leads ayant été relancés
        const totalRelancedLeads = nrpLeadsCount + devisEnvoyeCount
        const currentConversionRate =
          totalRelancedLeads > 0 ? (devisEnvoyeCount / totalRelancedLeads) * 100 : 0

        // Récupérer le taux précédent
        const storedPreviousRate = localStorage.getItem('previousConversionRate')
        const previousRate = storedPreviousRate
          ? parseFloat(storedPreviousRate)
          : currentConversionRate

        let conversionChangePercent = 0
        let conversionTrendValue: 'up' | 'down' = 'up'

        if (previousRate > 0 && currentConversionRate !== previousRate) {
          // Pour le taux de conversion, on calcule la différence en points de pourcentage
          conversionChangePercent = currentConversionRate - previousRate
          conversionTrendValue = conversionChangePercent >= 0 ? 'up' : 'down'
        }

        setConversionRate(`${currentConversionRate.toFixed(1)}%`)
        setConversionChange(
          `${conversionChangePercent >= 0 ? '+' : ''}${conversionChangePercent.toFixed(1)}pt`
        )
        setConversionTrend(conversionTrendValue)
        localStorage.setItem('previousConversionRate', currentConversionRate.toString())

        console.log(`📊 Dashboard chargé:`)
        console.log(
          `   • ${currentCount} leads (${leadsChangePercent >= 0 ? '+' : ''}${leadsChangePercent.toFixed(1)}%)`
        )
        console.log(
          `   • ${currentSmsCount} SMS envoyés (${smsChangePercent >= 0 ? '+' : ''}${smsChangePercent.toFixed(1)}%)`
        )
        console.log(
          `   • ${currentEmailCount} Emails envoyés (${emailChangePercent >= 0 ? '+' : ''}${emailChangePercent.toFixed(1)}%)`
        )
        console.log(
          `   • ${currentConversionRate.toFixed(1)}% taux conversion (${conversionChangePercent >= 0 ? '+' : ''}${conversionChangePercent.toFixed(1)}pt)`
        )
        console.log(`   • NRP: ${nrpLeadsCount} | Devis Envoyé: ${devisEnvoyeCount}`)
      }
    } catch (error) {
      console.error('❌ Erreur loadLeadsCount:', error)
    } finally {
      setLoading(false)
    }
  }

  // Formater le nombre avec séparateur de milliers
  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR')
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header - Stack vertical sur mobile */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-end">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Suivi Relances NRP</h1>
          <p className="text-slate-400 text-sm md:text-base">
            Gestion des clients "Ne Répond Pas" et taux de récupération.
          </p>
        </div>
        <button
          onClick={() => router.push('/campaign/new')}
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
          value={loading ? '...' : formatNumber(leadsCount)}
          change={leadsChange}
          trend={leadsTrend}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Relances SMS"
          value={loading ? '...' : formatNumber(smsCount)}
          change={smsChange}
          trend={smsTrend}
          icon={MessageSquare}
          color="purple"
        />
        <StatCard
          title="Relances Email"
          value={loading ? '...' : formatNumber(emailCount)}
          change={emailChange}
          trend={emailTrend}
          icon={Send}
          color="indigo"
        />
        <StatCard
          title="Taux de Conversion"
          value={loading ? '...' : conversionRate}
          change={conversionChange}
          trend={conversionTrend}
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Charts & Recent - Stack vertical sur mobile/tablette */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-[#111114] border border-slate-800 p-6 md:p-8 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold">Activité des campagnes</h2>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
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
                    backgroundColor: '#111114',
                    borderColor: '#1f2937',
                    borderRadius: '12px',
                    color: '#fff',
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
          <h2 className="text-lg md:text-xl font-bold mb-6">Campagnes récentes</h2>
          <div className="space-y-4 md:space-y-6">
            {[
              {
                name: 'SMS NRP',
                type: 'Email',
                status: 'Envoyé',
                date: 'Hier, 14:00',
              },
              {
                name: 'Rappel ITE',
                type: 'SMS',
                status: 'En cours',
                date: "Aujourd'hui, 10:30",
              },
              {
                name: 'Nouveau Produit',
                type: 'Email',
                status: 'Planifié',
                date: 'Demain, 09:00',
              },
              {
                name: 'Feedback Client',
                type: 'SMS',
                status: 'Envoyé',
                date: '27 Jan, 16:45',
              },
            ].map((campaign, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-800 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors flex-shrink-0">
                    {campaign.type === 'Email' ? (
                      <Send className="w-5 h-5" />
                    ) : (
                      <MessageSquare className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{campaign.name}</p>
                    <p className="text-xs text-slate-500">{campaign.date}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase whitespace-nowrap ml-2 ${
                    campaign.status === 'Envoyé'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : campaign.status === 'En cours'
                        ? 'bg-indigo-500/10 text-indigo-500 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push('/campaign/history')}
            className="w-full mt-6 md:mt-8 py-3 rounded-xl border border-slate-800 text-slate-400 font-medium hover:bg-white/5 transition-colors text-sm md:text-base"
          >
            Voir tout l'historique
          </button>
        </div>
      </div>
    </div>
  )
}
