import fs from 'fs'
import csvParser from 'csv-parser'
import Lead from '../models/Lead.model'
import ImportHistory from '../models/ImportHistory.model'

/**
 * INTERFACE pour les lignes du CSV
 */
interface CSVRow {
  ref?: string
  date?: string
  heure?: string
  nom?: string
  prenom?: string
  mobile?: string
  email?: string
  adresse?: string
  codePostal?: string
  source?: string
  telepro?: string
  equipe?: string
  rapport?: string
  observation?: string
  typeInstallation?: string
  [key: string]: any
}

/**
 * RÉSULTAT de l'import
 */
interface ImportResult {
  success: boolean
  message: string
  importHistoryId?: string
  stats: {
    total: number
    success: number
    errors: number
  }
  errors?: string[]
}

/**
 * SERVICE D'IMPORT CSV
 */
export class CSVService {
  /**
   * Générer une référence unique si non fournie
   */
  private static generateRef(): string {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 10000)
    return `LEAD-${timestamp}-${random}`
  }

  /**
   * Parser une date depuis le CSV
   */
  private static parseDate(dateString: string): Date {
    // Adapter selon votre format de date dans le CSV
    // Exemple: "29/01/2025" ou "2025-01-29"
    const parts = dateString.split('/')
    if (parts.length === 3) {
      // Format: DD/MM/YYYY
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`)
    }
    return new Date(dateString)
  }

  /**
   * Méthode principale pour importer un fichier CSV
   */
  static async importCSV(filePath: string, fileName: string): Promise<ImportResult> {
    // Créer un enregistrement dans l'historique
    const importHistory = await ImportHistory.create({
      nomFichier: fileName,
      nombreLeads: 0,
      nombreSucces: 0,
      nombreEchecs: 0,
      statut: 'en_cours',
    })

    const stats = {
      total: 0,
      success: 0,
      errors: 0,
    }

    const errors: string[] = []
    const rows: CSVRow[] = []

    try {
      // Lire le fichier CSV
      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (row: CSVRow) => {
            rows.push(row)
            stats.total++
          })
          .on('end', () => resolve())
          .on('error', (error) => reject(error))
      })

      console.log(`📊 ${stats.total} lignes trouvées dans le CSV`)

      // Traiter chaque ligne
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const lineNumber = i + 2 // +2 car ligne 1 = header et index commence à 0

        try {
          // Valider les champs obligatoires
          if (
            !row.nom ||
            !row.prenom ||
            !row.email ||
            !row.mobile ||
            !row.codePostal ||
            !row.source
          ) {
            throw new Error(
              'Champs obligatoires manquants (nom, prenom, email, mobile, codePostal, source)'
            )
          }

          // Générer une ref si non fournie
          const ref = row.ref?.trim() || this.generateRef()

          // Parser la date
          const date = row.date ? this.parseDate(row.date) : new Date()

          // Créer ou mettre à jour le lead
          await Lead.findOneAndUpdate(
            { ref: ref }, // Recherche par référence unique
            {
              ref: ref,
              date: date,
              heure: row.heure?.trim() || new Date().toLocaleTimeString('fr-FR'),
              nom: row.nom.trim(),
              prenom: row.prenom.trim(),
              mobile: row.mobile.trim(),
              email: row.email.toLowerCase().trim(),
              adresse: row.adresse?.trim() || '',
              codePostal: row.codePostal.trim(),
              source: row.source.trim(),
              telepro: row.telepro?.trim() || '',
              equipe: row.equipe?.trim() || '',
              rapport: row.rapport?.trim() || 'NOUVEAU PROSPECT',
              observation: row.observation?.trim() || '',
              typeInstallation: row.typeInstallation?.trim() || '',
              importedAt: new Date(),
            },
            {
              upsert: true, // Crée si n'existe pas
              new: true, // Retourne le document mis à jour
              runValidators: true, // Exécute les validations du schéma
            }
          )

          stats.success++
          console.log(`✅ Ligne ${lineNumber}: Lead créé/mis à jour (${ref})`)
        } catch (error: any) {
          stats.errors++
          const errorMsg = `Ligne ${lineNumber}: ${error.message}`
          errors.push(errorMsg)
          console.error(`❌ ${errorMsg}`)
        }
      }

      // Mettre à jour l'historique
      await ImportHistory.findByIdAndUpdate(importHistory._id, {
        nombreLeads: stats.total,
        nombreSucces: stats.success,
        nombreEchecs: stats.errors,
        statut: 'termine',
        erreurs: errors,
      })

      return {
        success: true,
        message: `Import terminé: ${stats.success} réussis, ${stats.errors} échecs`,
        importHistoryId: importHistory._id.toString(),
        stats,
        errors: errors.length > 0 ? errors : undefined,
      }
    } catch (error: any) {
      // En cas d'erreur globale
      await ImportHistory.findByIdAndUpdate(importHistory._id, {
        statut: 'echec',
        erreurs: [error.message],
      })

      throw new Error(`Erreur lors de l'import: ${error.message}`)
    }
  }

  /**
   * Valider le format du CSV
   */
  static async validateCSV(filePath: string): Promise<{ valid: boolean; message: string }> {
    const requiredHeaders = ['nom', 'prenom', 'email', 'mobile', 'codePostal', 'source']

    return new Promise((resolve, reject) => {
      let headers: string[] = []

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('headers', (headerList: string[]) => {
          headers = headerList.map((h) => h.toLowerCase().trim())
        })
        .on('data', () => {
          // On lit juste pour déclencher 'headers'
        })
        .on('end', () => {
          const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h))

          if (missingHeaders.length > 0) {
            resolve({
              valid: false,
              message: `Colonnes manquantes: ${missingHeaders.join(', ')}`,
            })
          } else {
            resolve({
              valid: true,
              message: 'Format CSV valide',
            })
          }
        })
        .on('error', (error) => reject(error))
    })
  }
}
