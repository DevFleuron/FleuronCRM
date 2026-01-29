import mongoose, { Document, Schema } from 'mongoose'

/**
 * Interface pour l'historique d'import
 */
export interface IImportHistory {
  nomFichier: string
  nombreLeads: number
  nombreSucces: number
  nombreEchecs: number
  dateImport: Date
  statut: 'en_cours' | 'termine' | 'echec'
  erreurs?: string[] // Liste des erreurs rencontrées
  utilisateur?: string // ID de l'utilisateur (optionnel)
}

export interface IImportHistoryDocument extends IImportHistory, Document {}

/**
 * Schema pour l'historique d'import
 */
const ImportHistorySchema: Schema = new Schema(
  {
    nomFichier: {
      type: String,
      required: true,
      trim: true,
    },
    nombreLeads: {
      type: Number,
      required: true,
      min: 0, // Nombre positif ou zéro
    },
    nombreSucces: {
      type: Number,
      required: true,
      min: 0,
    },
    nombreEchecs: {
      type: Number,
      required: true,
      min: 0,
    },
    dateImport: {
      type: Date,
      default: Date.now,
    },
    statut: {
      type: String,
      enum: ['en_cours', 'termine', 'echec'],
      default: 'en_cours',
    },
    erreurs: {
      type: [String], // Tableau de strings
      default: [],
    },
    utilisateur: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Index pour récupérer rapidement les derniers imports
ImportHistorySchema.index({ dateImport: -1 })

export default mongoose.model<IImportHistoryDocument>('ImportHistory', ImportHistorySchema)
