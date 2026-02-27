import mongoose, { Schema, Document } from "mongoose";

export interface ISequenceStep {
  stepNumber: number;
  type: "sms" | "email";
  templateId: mongoose.Types.ObjectId;
  delayDays: number;
}

export interface ISequenceRecipient {
  leadId: mongoose.Types.ObjectId;
  leadRef: string;
  status: "pending" | "in_progress" | "completed" | "stopped";
  currentStep: number;
  nextActionAt?: Date;
  stepsCompleted: Array<{
    stepNumber: number;
    completedAt: Date;
    success: boolean;
    error?: string;
  }>;
  enrolledAt: Date;
  completedAt?: Date;
  stoppedAt?: Date;
  stopReason?: string;
}

export interface ISequenceCampaign extends Document {
  name: string;
  steps: ISequenceStep[];
  recipients: ISequenceRecipient[];
  recipientsCount: number;
  activeCount: number;
  completedCount: number;
  stoppedCount: number;
  status: "draft" | "active" | "completed";
  startedAt?: Date;
  completedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const SequenceStepSchema = new Schema({
  stepNumber: Number,
  type: String,
  templateId: { type: Schema.Types.ObjectId, ref: "Template" },
  delayDays: Number,
});

const SequenceRecipientSchema = new Schema({
  leadId: { type: Schema.Types.ObjectId, ref: "Lead" },
  leadRef: String,
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "stopped"],
    default: "pending",
  },
  currentStep: { type: Number, default: 0 },
  nextActionAt: Date,
  stepsCompleted: [
    {
      stepNumber: Number,
      completedAt: Date,
      success: Boolean,
      error: String,
    },
  ],
  enrolledAt: { type: Date, default: Date.now },
  completedAt: Date,
  stoppedAt: Date,
  stopReason: String,
});

const SequenceCampaignSchema = new Schema(
  {
    name: String,
    steps: [SequenceStepSchema],
    recipients: [SequenceRecipientSchema],
    recipientsCount: { type: Number, default: 0 },
    activeCount: { type: Number, default: 0 },
    completedCount: { type: Number, default: 0 },
    stoppedCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "draft",
    },
    startedAt: Date,
    completedAt: Date,
    createdBy: { type: String, default: "admin" },
  },
  { timestamps: true },
);

SequenceCampaignSchema.index({ "recipients.nextActionAt": 1, status: 1 });
SequenceCampaignSchema.index({ "recipients.leadId": 1 });

export default mongoose.model<ISequenceCampaign>(
  "SequenceCampaign",
  SequenceCampaignSchema,
);
