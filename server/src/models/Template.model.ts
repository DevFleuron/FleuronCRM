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
  bannerUrl?: string;
  attachment?: {
    filename: string;
    path: string;
    url: string;
    size: number;
    mimetype: string;
  };
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
    bannerUrl: {
      type: String,
      trim: true,
    },
    attachment: {
      filename: String,
      path: String,
      url: String,
      size: Number,
      mimetype: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITemplate>("Template", TemplateSchema);
