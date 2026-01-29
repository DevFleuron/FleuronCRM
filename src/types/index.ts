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
    | "CLIENT"
    | "PERDU"
    | "RDV PRIS"
    | "A RAPPELER";
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
