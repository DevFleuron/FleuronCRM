import { Request, Response } from 'express'
import { CSVService } from '../services/csv.service'
import { deleteFile } from '../config/multer'

/**
 * CONTRÔLEUR D'IMPORT CSV
 */

/**
 * POST /api/import/csv
 * Importer un fichier CSV
 */
export const importCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    // Vérifier qu'un fichier a été uploadé
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni',
      })
      return
    }

    console.log(`📁 Fichier reçu: ${req.file.originalname}`)

    // Valider le CSV (optionnel mais recommandé)
    const validation = await CSVService.validateCSV(req.file.path)

    if (!validation.valid) {
      // Supprimer le fichier si invalide
      deleteFile(req.file.path)

      res.status(400).json({
        success: false,
        message: validation.message,
      })
      return
    }

    // Importer le CSV
    const result = await CSVService.importCSV(req.file.path, req.file.originalname)

    // Supprimer le fichier après traitement
    deleteFile(req.file.path)

    // Réponse
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        importHistoryId: result.importHistoryId,
        stats: result.stats,
        errors: result.errors,
      },
    })
  } catch (error: any) {
    console.error('❌ Erreur importCSV:', error)

    // Supprimer le fichier en cas d'erreur
    if (req.file) {
      deleteFile(req.file.path)
    }

    res.status(500).json({
      success: false,
      message: "Erreur lors de l'import du fichier CSV",
      error: error.message,
    })
  }
}

/**
 * GET /api/import/template
 * Télécharger un fichier template CSV
 */
export const downloadTemplate = (req: Request, res: Response): void => {
  try {
    // Créer un CSV template avec votre structure
    const template = `ref,date,heure,nom,prenom,mobile,email,adresse,codePostal,source,telepro,equipe,rapport,observation,typeInstallation
LEAD-001,29/01/2025,14:30,Dupont,Jean,0612345678,jean.dupont@example.com,123 Rue de Paris,75001,Site web,Marie Dubois,Equipe A,NOUVEAU PROSPECT,Client potentiel,Photovoltaïque
LEAD-002,29/01/2025,15:45,Martin,Sophie,0623456789,sophie.martin@example.com,456 Avenue Victor Hugo,69001,Téléphone,Paul Bernard,Equipe B,RDV PRIS,RDV fixé pour le 05/02,Pompe à chaleur`

    // Définir les headers pour le téléchargement
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename=template-leads-fleuroncrm.csv')
    res.status(200).send('\uFEFF' + template) // \uFEFF = BOM UTF-8 pour Excel
  } catch (error: any) {
    console.error('❌ Erreur downloadTemplate:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du template',
      error: error.message,
    })
  }
}
