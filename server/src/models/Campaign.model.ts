import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface pour un destinataire de campagne
 */
export interface ICampaignRecipient {
  leadId: mongoose.Types.ObjectId;
  leadRef: string; // Pour référence rapide
  status: "pending" | "sent" | "delivered" | "failed" | "removed";
  scheduledAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  removedAt?: Date;
  removeReason?: "status_changed" | "manual" | "unsubscribed" | "bounced";
  removeDetails?: {
    importId?: mongoose.Types.ObjectId;
    oldStatus?: string;
    newStatus?: string;
  };
  error?: string;
}

/**
 * Interface pour une campagne
 */
export interface ICampaign {
  name: string;
  type: "sms" | "email";
  templateId: mongoose.Types.ObjectId;
  recipients: ICampaignRecipient[];
  recipientsCount: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  removedCount: number;
  status: "draft" | "scheduled" | "sending" | "sent" | "failed";
  scheduledAt?: Date;
  sentAt?: Date;
  createdBy?: string; // ID utilisateur
}

export interface ICampaignDocument extends ICampaign, Document {}

const CampaignSchema: Schema = new Schema<ICampaignDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["sms", "email"],
      required: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    recipients: {
      type: [
        {
          leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
          leadRef: { type: String, required: true },
          status: {
            type: String,
            enum: ["pending", "sent", "delivered", "failed", "removed"],
            default: "pending",
          },
          scheduledAt: { type: Date },
          sentAt: { type: Date },
          deliveredAt: { type: Date },
          removedAt: { type: Date },
          removeReason: {
            type: String,
            enum: ["status_changed", "manual", "unsubscribed", "bounced"],
          },
          removeDetails: {
            type: {
              importId: { type: Schema.Types.ObjectId, ref: "ImportHistory" },
              oldStatus: { type: String },
              newStatus: { type: String },
            },
          },
          error: { type: String },
        },
      ],
      default: [],
    },
    recipientsCount: {
      type: Number,
      required: true,
      min: 0,
    },
    sentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    failedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    removedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "sent", "failed"],
      default: "draft",
    },
    scheduledAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
    createdBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Index
CampaignSchema.index({ status: 1, createdAt: -1 });
CampaignSchema.index({ "recipients.leadId": 1 });
CampaignSchema.index({ "recipients.status": 1 });

export default mongoose.model<ICampaignDocument>("Campaign", CampaignSchema);
