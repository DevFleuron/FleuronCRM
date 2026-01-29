import { Request, Response } from 'express'
import Lead from '../models/Lead.model'

/**
 * CONTRÔLEUR DES LEADS
 * Contient toute la logique métier pour les endpoints
 */

/**
 * GET /api/leads
 * Récupérer tous les leads avec pagination et filtres
 */
export const getAllLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    // Paramètres de pagination (depuis l'URL)
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // Paramètres de filtre
    const rapport = req.query.rapport as string
    const source = req.query.source as string
    const search = req.query.search as string
    const equipe = req.query.equipe as string

    // Construire le filtre
    let filter: any = {}

    if (rapport) {
      filter.rapport = rapport
    }

    if (source) {
      filter.source = source
    }

    if (equipe) {
      filter.equipe = equipe
    }

    if (search) {
      // Recherche dans nom, prenom, email, mobile, ref
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } }, // i = insensible à la casse
        { prenom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } },
        { ref: { $regex: search, $options: 'i' } },
      ]
    }

    // Récupérer les leads
    const leads = await Lead.find(filter)
      .sort({ date: -1, createdAt: -1 }) // Trier par date décroissante
      .skip(skip)
      .limit(limit)

    // Compter le total (pour la pagination)
    const total = await Lead.countDocuments(filter)

    // Réponse
    res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('❌ Erreur getAllLeads:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des leads',
      error: error.message,
    })
  }
}

/**
 * GET /api/leads/:id
 * Récupérer un lead spécifique par son ID
 */
export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const lead = await Lead.findById(id)

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead non trouvé',
      })
      return
    }

    res.status(200).json({
      success: true,
      data: lead,
    })
  } catch (error: any) {
    console.error('❌ Erreur getLeadById:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du lead',
      error: error.message,
    })
  }
}

/**
 * GET /api/leads/ref/:ref
 * Récupérer un lead par sa référence
 */
export const getLeadByRef = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ref } = req.params

    const lead = await Lead.findOne({ ref })

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead non trouvé',
      })
      return
    }

    res.status(200).json({
      success: true,
      data: lead,
    })
  } catch (error: any) {
    console.error('❌ Erreur getLeadByRef:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du lead',
      error: error.message,
    })
  }
}

/**
 * POST /api/leads
 * Créer un nouveau lead manuellement
 */
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const leadData = req.body

    // Vérifier si la référence existe déjà
    if (leadData.ref) {
      const existingLead = await Lead.findOne({ ref: leadData.ref })

      if (existingLead) {
        res.status(400).json({
          success: false,
          message: 'Un lead avec cette référence existe déjà',
        })
        return
      }
    }

    // Générer une référence si non fournie
    if (!leadData.ref) {
      const timestamp = Date.now()
      const random = Math.floor(Math.random() * 10000)
      leadData.ref = `LEAD-${timestamp}-${random}`
    }

    // Valeurs par défaut
    if (!leadData.rapport) {
      leadData.rapport = 'NOUVEAU PROSPECT'
    }

    if (!leadData.date) {
      leadData.date = new Date()
    }

    if (!leadData.heure) {
      leadData.heure = new Date().toLocaleTimeString('fr-FR')
    }

    // Créer le lead
    const lead = await Lead.create(leadData)

    res.status(201).json({
      success: true,
      message: 'Lead créé avec succès',
      data: lead,
    })
  } catch (error: any) {
    console.error('❌ Erreur createLead:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du lead',
      error: error.message,
    })
  }
}

/**
 * PUT /api/leads/:id
 * Mettre à jour un lead
 */
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const updateData = req.body

    // Mettre à jour lastContactDate si le rapport change
    if (updateData.rapport && updateData.rapport !== 'NOUVEAU PROSPECT') {
      updateData.lastContactDate = new Date()
    }

    const lead = await Lead.findByIdAndUpdate(id, updateData, {
      new: true, // Retourne le document mis à jour
      runValidators: true, // Exécute les validations
    })

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead non trouvé',
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Lead mis à jour avec succès',
      data: lead,
    })
  } catch (error: any) {
    console.error('❌ Erreur updateLead:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du lead',
      error: error.message,
    })
  }
}

/**
 * DELETE /api/leads/:id
 * Supprimer un lead
 */
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const lead = await Lead.findByIdAndDelete(id)

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead non trouvé',
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Lead supprimé avec succès',
    })
  } catch (error: any) {
    console.error('❌ Erreur deleteLead:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du lead',
      error: error.message,
    })
  }
}

/**
 * GET /api/leads/stats
 * Récupérer les statistiques des leads
 */
export const getLeadsStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const total = await Lead.countDocuments()
    const nouveauProspect = await Lead.countDocuments({ rapport: 'NOUVEAU PROSPECT' })
    const nrp = await Lead.countDocuments({ rapport: 'NRP' })
    const client = await Lead.countDocuments({ rapport: 'CLIENT' })
    const perdu = await Lead.countDocuments({ rapport: 'PERDU' })
    const rdvPris = await Lead.countDocuments({ rapport: 'RDV PRIS' })
    const aRappeler = await Lead.countDocuments({ rapport: 'A RAPPELER' })

    // Stats par source
    const statsBySource = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    // Stats par équipe
    const statsByEquipe = await Lead.aggregate([
      {
        $match: { equipe: { $ne: '' } }, // Exclure les équipes vides
      },
      {
        $group: {
          _id: '$equipe',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ])

    res.status(200).json({
      success: true,
      data: {
        total,
        parRapport: {
          nouveauProspect,
          nrp,
          client,
          perdu,
          rdvPris,
          aRappeler,
        },
        parSource: statsBySource,
        parEquipe: statsByEquipe,
      },
    })
  } catch (error: any) {
    console.error('❌ Erreur getLeadsStats:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message,
    })
  }
}

/**
 * PATCH /api/leads/:id/sms
 * Marquer un SMS comme envoyé
 */
export const markSmsAsSent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const lead = await Lead.findByIdAndUpdate(
      id,
      {
        smsEnvoye: true,
        smsSentAt: new Date(),
        $inc: { smsCount: 1 }, // Incrémenter le compteur
      },
      { new: true }
    )

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead non trouvé',
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'SMS marqué comme envoyé',
      data: lead,
    })
  } catch (error: any) {
    console.error('❌ Erreur markSmsAsSent:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message,
    })
  }
}

/**
 * PATCH /api/leads/:id/email
 * Marquer un email comme envoyé
 */
export const markEmailAsSent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const lead = await Lead.findByIdAndUpdate(
      id,
      {
        emailEnvoye: true,
        emailSentAt: new Date(),
        $inc: { emailCount: 1 }, // Incrémenter le compteur
      },
      { new: true }
    )

    if (!lead) {
      res.status(404).json({
        success: false,
        message: 'Lead non trouvé',
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Email marqué comme envoyé',
      data: lead,
    })
  } catch (error: any) {
    console.error('❌ Erreur markEmailAsSent:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour',
      error: error.message,
    })
  }
}
