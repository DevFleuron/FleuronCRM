import mongoose, { Document, Schema } from "mongoose";

export interface ISettings extends Document {
  rapports: string[];
  sources: string[];
}

const SettingsSchema = new Schema<ISettings>(
  {
    rapports: { type: [String], default: [] },
    sources: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model<ISettings>("Settings", SettingsSchema);
