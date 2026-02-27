import mongoose, { Document, Schema } from "mongoose";

/*
 Interface pour un changement détecté
 */
export interface IDetectedChange {
  leadRef: string;
  leadId: mongoose.Types.ObjectId;
  field: string; // 'rapport', 'mobile', 'email', etc.
  oldValue: string;
  newValue: string;
  action: "updated" | "removed_from_campaigns" | "none";
  timestamp: Date;
}

/*
 Interface pour l'historique d'import
 */
export interface IImportHistory {
  nomFichier: string;
  nombreLeads: number;
  nombreSucces: number;
  nombreEchecs: number;
  nombreMisesAJour: number;
  nombreNouveaux: number;
  dateImport: Date;
  statut: "en_cours" | "termine" | "echec";
  erreurs?: string[];
  changes?: IDetectedChange[];
  processingTime?: number;
  utilisateur?: string;
}

export interface IImportHistoryDocument extends IImportHistory, Document {}

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
      min: 0,
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
    nombreMisesAJour: {
      type: Number,
      default: 0,
      min: 0,
    },
    nombreNouveaux: {
      type: Number,
      default: 0,
      min: 0,
    },
    dateImport: {
      type: Date,
      default: Date.now,
    },
    statut: {
      type: String,
      enum: ["en_cours", "termine", "echec"],
      default: "en_cours",
    },
    erreurs: {
      type: [String],
      default: [],
    },
    changes: {
      type: [
        {
          leadRef: { type: String, required: true },
          leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
          field: { type: String, required: true },
          oldValue: { type: String },
          newValue: { type: String },
          action: {
            type: String,
            enum: ["updated", "removed_from_campaigns", "none"],
            default: "updated",
          },
          timestamp: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    processingTime: {
      type: Number, // en secondes
    },
    utilisateur: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

ImportHistorySchema.index({ dateImport: -1 });

export default mongoose.model<IImportHistoryDocument>(
  "ImportHistory",
  ImportHistorySchema,
);
