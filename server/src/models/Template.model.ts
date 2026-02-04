import mongoose, { Document, Schema } from "mongoose";

export interface ITemplate {
  name: string;
  type: "sms" | "email";
  subject?: string; // Pour les emails uniquement
  content: string;
  variables: string[]; // ['nom', 'prenom', 'ref']
  usageCount: number;
}

export interface ITemplateDocument extends ITemplate, Document {}

const TemplateSchema: Schema = new Schema<ITemplateDocument>(
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
    subject: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    variables: {
      type: [String],
      default: [],
    },
    usageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Index
TemplateSchema.index({ type: 1, createdAt: -1 });

export default mongoose.model<ITemplateDocument>("Template", TemplateSchema);
