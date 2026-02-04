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
    | "NRP 2"
    | "NRP 3"
    | "NRP 4"
    | "NRP 5"
    | "DEVIS ENVOYE";
  observation: string;
  typeInstallation: string;

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
  usageCount?: number; // Nombre de fois utilisé
}

export interface TemplateFormData {
  name: string;
  type: "sms" | "email";
  subject?: string;
  content: string;
}

export interface Campaign {
  _id?: string;
  name: string;
  type: "sms" | "email";
  templateId: string;
  recipients: string[]; // IDs des leads
  recipientsCount: number;
  sentCount: number;
  failedCount: number;
  status: "draft" | "sending" | "sent" | "failed";
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
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
