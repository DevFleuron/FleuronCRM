import mongoose, { Document, Schema } from 'mongoose'

/**
 * INTERFACE TypeScript pour un Lead
 */
export interface ILead {
  ref: string // Référence unique du lead
  date: Date // Date du lead
  heure: string // Heure du lead
  nom: string
  prenom: string
  mobile: string
  email: string
  adresse?: string
  codePostal: string
  source: string // Source du lead (site web, téléphone, etc.)
  telepro?: string // Nom du téléprospecteur
  equipe?: string // Équipe assignée
  rapport: 'NOUVEAU PROSPECT' | 'NRP' | 'CLIENT' | 'PERDU' | 'RDV PRIS' | 'A RAPPELER'
  observation?: string // Notes et observations
  typeInstallation?: string // Type d'installation

  // Gestion des SMS
  smsEnvoye: boolean
  smsSentAt?: Date
  smsCount: number

  // Gestion des emails
  emailEnvoye: boolean
  emailSentAt?: Date
  emailCount: number

  // Dates de suivi
  importedAt: Date
  lastContactDate?: Date
}

/**
 * INTERFACE Document Mongoose
 */
export interface ILeadDocument extends ILead, Document {}

/**
 * SCHEMA Mongoose
 */
const LeadSchema: Schema = new Schema<ILeadDocument>(
  {
    ref: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    heure: {
      type: String,
      required: true,
      trim: true,
    },
    nom: {
      type: String,
      required: true,
      trim: true,
    },
    prenom: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    adresse: {
      type: String,
      default: '',
      trim: true,
    },
    codePostal: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    telepro: {
      type: String,
      default: '',
      trim: true,
    },
    equipe: {
      type: String,
      default: '',
      trim: true,
    },
    rapport: {
      type: String,
      enum: ['NOUVEAU PROSPECT', 'NRP', 'CLIENT', 'PERDU', 'RDV PRIS', 'A RAPPELER'],
      required: true,
      default: 'NRP',
    },
    observation: {
      type: String,
      default: '',
      trim: true,
    },
    typeInstallation: {
      type: String,
      default: '',
      trim: true,
    },

    // Gestion des SMS
    smsEnvoye: {
      type: Boolean,
      default: false,
    },
    smsSentAt: {
      type: Date,
    },
    smsCount: {
      type: Number,
      default: 0,
    },

    // Gestion des emails
    emailEnvoye: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
    },
    emailCount: {
      type: Number,
      default: 0,
    },

    // Dates
    importedAt: {
      type: Date,
      default: Date.now,
    },
    lastContactDate: {
      type: Date,
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
)

/**
 * INDEX pour améliorer les performances
 */
LeadSchema.index({ rapport: 1, date: -1 })
LeadSchema.index({ ref: 1 })
LeadSchema.index({ email: 1 })
LeadSchema.index({ mobile: 1 })
LeadSchema.index({ source: 1 })
LeadSchema.index({ date: -1 }) // Pour trier par date décroissante

/**
 * EXPORT du modèle
 */
export default mongoose.model<ILeadDocument>('Lead', LeadSchema)
