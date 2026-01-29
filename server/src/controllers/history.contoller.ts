import { Request, Response } from 'express'
import ImportHistory from '../models/ImportHistory.model'

/**
 * CONTRÔLEUR DE L'HISTORIQUE DES IMPORTS
 */

/**
 * GET /api/history
 * Récupérer l'historique des imports avec pagination
 */
export const getImportHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    // Paramètres de pagination
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    // Récupérer l'historique
    const history = await ImportHistory.find()
      .sort({ dateImport: -1 }) // Plus récent en premier
      .skip(skip)
      .limit(limit)

    // Compter le total
    const total = await ImportHistory.countDocuments()

    res.status(200).json({
      success: true,
      data: history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('❌ Erreur getImportHistory:', error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'historique",
      error: error.message,
    })
  }
}

/**
 * GET /api/history/:id
 * Récupérer un import spécifique par son ID
 */
export const getImportById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const importRecord = await ImportHistory.findById(id)

    if (!importRecord) {
      res.status(404).json({
        success: false,
        message: 'Import non trouvé',
      })
      return
    }

    res.status(200).json({
      success: true,
      data: importRecord,
    })
  } catch (error: any) {
    console.error('❌ Erreur getImportById:', error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'import",
      error: error.message,
    })
  }
}

/**
 * DELETE /api/history/:id
 * Supprimer un enregistrement d'historique
 */
export const deleteImportHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const importRecord = await ImportHistory.findByIdAndDelete(id)

    if (!importRecord) {
      res.status(404).json({
        success: false,
        message: 'Import non trouvé',
      })
      return
    }

    res.status(200).json({
      success: true,
      message: 'Historique supprimé avec succès',
    })
  } catch (error: any) {
    console.error('❌ Erreur deleteImportHistory:', error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'historique",
      error: error.message,
    })
  }
}

/**
 * GET /api/history/stats
 * Récupérer les statistiques des imports
 */
export const getImportStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalImports = await ImportHistory.countDocuments()
    const successfulImports = await ImportHistory.countDocuments({ statut: 'termine' })
    const failedImports = await ImportHistory.countDocuments({ statut: 'echec' })

    // Statistiques agrégées
    const aggregateStats = await ImportHistory.aggregate([
      {
        $group: {
          _id: null,
          totalLeads: { $sum: '$nombreLeads' },
          totalSuccess: { $sum: '$nombreSucces' },
          totalErrors: { $sum: '$nombreEchecs' },
        },
      },
    ])

    const stats = aggregateStats[0] || {
      totalLeads: 0,
      totalSuccess: 0,
      totalErrors: 0,
    }

    res.status(200).json({
      success: true,
      data: {
        totalImports,
        successfulImports,
        failedImports,
        totalLeadsImported: stats.totalLeads,
        totalLeadsSuccess: stats.totalSuccess,
        totalLeadsErrors: stats.totalErrors,
      },
    })
  } catch (error: any) {
    console.error('❌ Erreur getImportStats:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message,
    })
  }
}
