import mongoose, { Document, Schema } from "mongoose";

/**
 * INTERFACE pour l'historique des changements de statut
 */
export interface IStatusHistory {
  oldStatus: string;
  newStatus: string;
  changedAt: Date;
  importId?: mongoose.Types.ObjectId; // Référence à l'import qui a causé le changement
  source: "import" | "manual" | "webhook"; // Source du changement
}

/**
 * INTERFACE pour les stats Brevo
 */
export interface IBrevoStats {
  smsDelivered: number;
  smsOpened: number;
  smsClicked: number;
  lastSmsSentAt?: Date;
  lastSmsOpenedAt?: Date;

  emailDelivered: number;
  emailOpened: number;
  emailClicked: number;
  emailBounced: number;
  lastEmailSentAt?: Date;
  lastEmailOpenedAt?: Date;
  lastEmailClickedAt?: Date;
}

/**
 * INTERFACE TypeScript pour un Lead
 */
export interface ILead {
  ref: string; // Référence unique du lead
  date: Date;
  heure: string;
  nom: string;
  prenom: string;
  mobile: string;
  email: string;
  adresse?: string;
  codePostal: string;
  source: string;
  telepro?: string;
  equipe?: string;
  rapport:
    | "NOUVEAU PROSPECT"
    | "NRP"
    | "CLIENT"
    | "PERDU"
    | "RDV PRIS"
    | "A RAPPELER"
    | "DEVIS ENVOYE"; // ✅ Ajouté
  observation?: string;
  typeInstallation?: string;

  // Gestion des SMS (DEPRECATED - gardé pour compatibilité)
  smsEnvoye: boolean;
  smsSentAt?: Date;
  smsCount: number;

  // Gestion des emails (DEPRECATED - gardé pour compatibilité)
  emailEnvoye: boolean;
  emailSentAt?: Date;
  emailCount: number;

  // ✅ NOUVEAU : Stats Brevo détaillées
  brevoStats: IBrevoStats;

  // ✅ NOUVEAU : Historique des changements
  statusHistory: IStatusHistory[];

  // Dates de suivi
  importedAt: Date;
  lastImportedAt?: Date; // ✅ Date du dernier import
  importCount: number; // ✅ Nombre d'imports
  lastContactDate?: Date;
}

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
      trim: true,
      default: "",
      lowercase: true,
    },
    adresse: {
      type: String,
      default: "",
      trim: true,
    },
    codePostal: {
      type: String,
      default: "",
      trim: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    telepro: {
      type: String,
      default: "",
      trim: true,
    },
    equipe: {
      type: String,
      default: "",
      trim: true,
    },
    rapport: {
      type: String,
      enum: [
        "NOUVEAU PROSPECT",
        "NRP",
        "CLIENT",
        "PERDU",
        "RDV PRIS",
        "A RAPPELER",
        "DEVIS ENVOYE",
      ],
      required: true,
      default: "NRP",
    },
    observation: {
      type: String,
      default: "",
      trim: true,
    },
    typeInstallation: {
      type: String,
      default: "",
      trim: true,
    },

    // Gestion des SMS (DEPRECATED - gardé pour compatibilité)
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

    // Gestion des emails (DEPRECATED - gardé pour compatibilité)
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

    // ✅ NOUVEAU : Stats Brevo détaillées
    brevoStats: {
      type: {
        smsDelivered: { type: Number, default: 0 },
        smsOpened: { type: Number, default: 0 },
        smsClicked: { type: Number, default: 0 },
        lastSmsSentAt: { type: Date },
        lastSmsOpenedAt: { type: Date },

        emailDelivered: { type: Number, default: 0 },
        emailOpened: { type: Number, default: 0 },
        emailClicked: { type: Number, default: 0 },
        emailBounced: { type: Number, default: 0 },
        lastEmailSentAt: { type: Date },
        lastEmailOpenedAt: { type: Date },
        lastEmailClickedAt: { type: Date },
      },
      default: () => ({
        smsDelivered: 0,
        smsOpened: 0,
        smsClicked: 0,
        emailDelivered: 0,
        emailOpened: 0,
        emailClicked: 0,
        emailBounced: 0,
      }),
    },

    // ✅ NOUVEAU : Historique des changements
    statusHistory: {
      type: [
        {
          oldStatus: { type: String },
          newStatus: { type: String, required: true },
          changedAt: { type: Date, default: Date.now },
          importId: { type: Schema.Types.ObjectId, ref: "ImportHistory" },
          source: {
            type: String,
            enum: ["import", "manual", "webhook"],
            default: "import",
          },
        },
      ],
      default: [],
    },

    // Dates
    importedAt: {
      type: Date,
      default: Date.now,
    },
    lastImportedAt: {
      type: Date,
    },
    importCount: {
      type: Number,
      default: 1,
    },
    lastContactDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Index
LeadSchema.index({ rapport: 1, date: -1 });
LeadSchema.index({ ref: 1 });
LeadSchema.index({ email: 1 });
LeadSchema.index({ mobile: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ date: -1 });

export default mongoose.model<ILeadDocument>("Lead", LeadSchema);
