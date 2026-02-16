import mongoose, { Schema, Document } from "mongoose";

export interface ITemplate extends Document {
  name: string;
  type: "sms" | "email";
  subject?: string;
  content: string;
  variables: string[];
  usageCount: number;
  ctaText?: string;
  ctaUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TemplateSchema = new Schema<ITemplate>(
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
    ctaText: {
      type: String,
      trim: true,
    },
    ctaUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITemplate>("Template", TemplateSchema);
