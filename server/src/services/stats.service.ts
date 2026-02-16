import Lead from "../models/Lead.model";
import Campaign from "../models/Campaign.model";
import SequenceCampaign from "../models/SequenceCampaign.model";
import ImportHistory from "../models/ImportHistory.model";

export class StatsService {
  static async getDashboardStats() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // OVERVIEW
      const totalLeads = await Lead.countDocuments();
      const totalCampaigns = await Campaign.countDocuments();
      const totalImports = await ImportHistory.countDocuments();
      const leadsWithSMS = await Lead.countDocuments({ smsEnvoye: true });
      const leadsWithEmail = await Lead.countDocuments({ emailEnvoye: true });

      // Leads NRP actuels
      const totalLeadsNRP = await Lead.countDocuments({
        rapport: { $in: ["NRP", "NRP 1", "NRP 2", "NRP 3", "NRP 4", "NRP 5"] },
      });

      // Leads récupérés (sortis du NRP dans les 30 derniers jours)
      const allLeads = await Lead.find();
      let leadsRecuperes = 0;

      for (const lead of allLeads) {
        if (lead.statusHistory && lead.statusHistory.length > 0) {
          for (const history of lead.statusHistory) {
            if (
              history.changedAt >= thirtyDaysAgo &&
              ["NRP", "NRP 1", "NRP 2", "NRP 3", "NRP 4", "NRP 5"].includes(
                history.oldStatus || "",
              ) &&
              !["NRP", "NRP 1", "NRP 2", "NRP 3", "NRP 4", "NRP 5"].includes(
                history.newStatus,
              )
            ) {
              leadsRecuperes++;
              break;
            }
          }
        }
      }

      // Taux de conversion (leads sortis de NRP / total leads NRP)
      const conversionRate =
        totalLeadsNRP > 0
          ? Number(((leadsRecuperes / totalLeadsNRP) * 100).toFixed(1))
          : 0;

      const overview = {
        totalLeads,
        totalCampaigns,
        totalImports,
        leadsWithSMS,
        leadsWithEmail,
        totalLeadsNRP,
        leadsRecuperes,
        conversionRate,
      };

      // LEADS PAR STATUT
      const leadsByStatus = await Lead.aggregate([
        { $group: { _id: "$rapport", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      // STATS CAMPAGNES
      const campaigns = await Campaign.find();
      const campaignStats = {
        totalSent: campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0),
        totalFailed: campaigns.reduce(
          (sum, c) => sum + (c.failedCount || 0),
          0,
        ),
        totalDelivered: campaigns.reduce(
          (sum, c) => sum + (c.deliveredCount || 0),
          0,
        ),
      };

      // STATS BREVO DÉTAILLÉES
      const allLeadsWithStats = await Lead.find({
        $or: [
          { "brevoStats.emailDelivered": { $gt: 0 } },
          { "brevoStats.smsDelivered": { $gt: 0 } },
          { "brevoStats.emailOpened": { $gt: 0 } },
          { "brevoStats.smsOpened": { $gt: 0 } },
        ],
      }).lean();

      let totalSmsDelivered = 0;
      let totalSmsOpened = 0;
      let totalSmsClicked = 0;
      let totalEmailDelivered = 0;
      let totalEmailOpened = 0;
      let totalEmailClicked = 0;
      let totalEmailBounced = 0;

      allLeadsWithStats.forEach((lead) => {
        if (lead.brevoStats) {
          totalSmsDelivered += lead.brevoStats.smsDelivered || 0;
          totalSmsOpened += lead.brevoStats.smsOpened || 0;
          totalSmsClicked += lead.brevoStats.smsClicked || 0;
          totalEmailDelivered += lead.brevoStats.emailDelivered || 0;
          totalEmailOpened += lead.brevoStats.emailOpened || 0;
          totalEmailClicked += lead.brevoStats.emailClicked || 0;
          totalEmailBounced += lead.brevoStats.emailBounced || 0;
        }
      });

      // Calculer les taux
      const smsOpenRate =
        totalSmsDelivered > 0
          ? Number(((totalSmsOpened / totalSmsDelivered) * 100).toFixed(1))
          : 0;

      const emailOpenRate =
        totalEmailDelivered > 0
          ? Number(((totalEmailOpened / totalEmailDelivered) * 100).toFixed(1))
          : 0;

      const emailClickRate =
        totalEmailDelivered > 0
          ? Number(((totalEmailClicked / totalEmailDelivered) * 100).toFixed(1))
          : 0;

      const brevoStats = {
        totalSmsDelivered,
        totalSmsOpened,
        totalSmsClicked,
        totalEmailDelivered,
        totalEmailOpened,
        totalEmailClicked,
        totalEmailBounced,
        smsOpenRate,
        emailOpenRate,
        emailClickRate,
      };

      // ÉVOLUTION DES LEADS (30 derniers jours)
      const leadsEvolution = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = await Lead.countDocuments({
          createdAt: { $gte: date, $lt: nextDate },
        });

        leadsEvolution.push({
          date: date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
          }),
          count,
        });
      }

      // CAMPAGNES RÉCENTES
      const recentCampaigns = await Campaign.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      // IMPORTS RÉCENTS
      const recentImports = await ImportHistory.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      const result = {
        overview,
        leadsByStatus,
        campaignStats,
        brevoStats,
        leadsEvolution,
        recentCampaigns,
        recentImports,
      };

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      console.error("Erreur getDashboardStats:", error);
      return { success: false, error: error.message };
    }
  }
}
