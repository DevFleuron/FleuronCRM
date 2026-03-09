export interface Lead {
  _id?: string;
  ref: string;
  date: Date;
  heure: string;
  nom: string;
  prenom: string;
  mobile: string;
  email: string;
  adresse: string;
  codePostal: string;
  source: string;
  telepro: string;
  equipe: string;
  rapport:
    | "NOUVEAU PROSPECT"
    | "NRP"
    | "NRP 1"
    | "NRP 2"
    | "NRP 3"
    | "NRP 4"
    | "NRP 5"
    | "CLIENT"
    | "PERDU"
    | "RDV PRIS"
    | "A RAPPELER"
    | "DEVIS ENVOYE"
    | "DEVIS ENVOYE NRP 1"
    | "DEVIS ENVOYE NRP 2"
    | "PROSPECT A RETRAITER"
    | "DOUBLON";
  observation: string;
  typeInstallation: string;
  lastImportId?: string;

  smsEnvoye: boolean;
  smsSentAt?: Date;
  smsCount: number;
  emailEnvoye: boolean;
  emailSentAt?: Date;
  emailCount: number;
  importedAt: Date;
  lastContactDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LeadFilters {
  rapport?: string;
  source?: string;
  dateFrom?: string;
  dateTo?: string;
  telepro?: string;
  equipe?: string;
  typeInstallation?: string;
  smsEnvoye?: "all" | "yes" | "no";
  emailEnvoye?: "all" | "yes" | "no";
  search?: string;
  departement?: string;
  region?: string;
  importId?: string;
}

export interface DashboardStats {
  totalLeadsNRP: number;
  totalLeadsNRPEvolution: number;
  smsEnvoyes: number;
  smsEvolution: number;
  emailsEnvoyes: number;
  emailEvolution: number;
  tauxRecuperation: number;
  tauxRecuperationEvolution: number;
}

export interface ActivityData {
  month: string;
  sms: number;
  email: number;
}

export interface RecentCampaign {
  _id: string;
  name: string;
  type: "sms" | "email";
  status: "sent" | "sending" | "draft";
  recipientsCount: number;
  sentAt: Date;
}

export interface Template {
  _id?: string;
  name: string;
  type: "sms" | "email";
  subject?: string; // Pour email uniquement
  content: string;
  variables: string[]; // ['nom', 'prenom', 'ref']
  createdAt?: Date;
  updatedAt?: Date;
  usageCount?: number;
  ctaText?: string;
  ctaUrl?: string;
  attachment?: {
    filename: string;
    path: string;
    url: string;
    size: number;
    mimetype: string;
  };
}

export interface TemplateFormData {
  name: string;
  type: "sms" | "email";
  subject?: string;
  content: string;
  ctaText?: string;
  ctaUrl?: string;
  attachment?: {
    filename: string;
    path: string;
    url: string;
    size: number;
    mimetype: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

export interface Campaign {
  _id?: string;
  name: string;
  type: "sms" | "email";
  templateId: string;
  recipients: string[];
  recipientsCount: number;
  sentCount: number;
  failedCount: number;
  deliveredCount: number;
  removedCount: number;
  status: "draft" | "sending" | "sent" | "failed" | "scheduled";
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  brevoStats: {
    delivered: number;
    opened: number;
    clicked: number;
    spam: number;
    bounced: number;
    openRate: number;
    clickRate: number;
  };
}

export interface CampaignFormData {
  name: string;
  type: "sms" | "email";
  templateId: string;
  recipients: string[];
  filters?: LeadFilters;
  scheduledAt?: Date;
}

export interface WizardStep {
  number: number;
  title: string;
  description: string;
  isComplete: boolean;
}

export interface SequenceStep {
  stepNumber: number;
  type: "sms" | "email";
  templateId: string;
  delayDays: number;
}

export interface SequenceRecipient {
  leadId: string;
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

export interface SequenceCampaign {
  _id?: string;
  name: string;
  steps: SequenceStep[];
  recipients: SequenceRecipient[];
  recipientsCount: number;
  activeCount: number;
  completedCount: number;
  stoppedCount: number;
  status: "draft" | "active" | "completed";
  startedAt?: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
