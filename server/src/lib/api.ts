/*
 SERVICE API - FleuronCRM
 Communication avec le backend Express
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/*
 Interface pour un Lead (votre structure)
 */
export interface Lead {
  _id: string;
  ref: string;
  date: string;
  heure: string;
  nom: string;
  prenom: string;
  mobile: string;
  email: string;
  adresse?: string;
  codePostal: string;
  source: string;
  telepro?: string;
  equipe?: string;
  rapport:
    | "NOUVEAU PROSPECT"
    | "NRP"
    | "CLIENT"
    | "PERDU"
    | "RDV PRIS"
    | "A RAPPELER";
  observation?: string;
  typeInstallation?: string;
  smsEnvoye: boolean;
  smsSentAt?: string;
  smsCount: number;
  emailEnvoye: boolean;
  emailSentAt?: string;
  emailCount: number;
  importedAt: string;
  lastContactDate?: string;
  createdAt: string;
  updatedAt: string;
}

/*
 Interface pour l'historique d'import
 */
export interface ImportHistory {
  _id: string;
  nomFichier: string;
  nombreLeads: number;
  nombreSucces: number;
  nombreEchecs: number;
  dateImport: string;
  statut: "en_cours" | "termine" | "echec";
  erreurs?: string[];
  createdAt: string;
  updatedAt: string;
}

/*
 Interface pour la réponse paginée
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 Interface pour la réponse standard
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/*
 SERVICE LEADS
 */
export const leadsApi = {
  /*
   Récupérer tous les leads avec pagination et filtres
   */
  getAll: async (
    page: number = 1,
    limit: number = 10,
    rapport?: string,
    source?: string,
    search?: string,
    equipe?: string,
  ): Promise<PaginatedResponse<Lead>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (rapport) params.append("rapport", rapport);
    if (source) params.append("source", source);
    if (search) params.append("search", search);
    if (equipe) params.append("equipe", equipe);

    const response = await fetch(`${API_URL}/leads?${params}`);
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des leads");
    return response.json();
  },

  /*
   Récupérer un lead par son ID
   */
  getById: async (id: string): Promise<ApiResponse<Lead>> => {
    const response = await fetch(`${API_URL}/leads/${id}`);
    if (!response.ok) throw new Error("Erreur lors de la récupération du lead");
    return response.json();
  },

  /*
   Récupérer un lead par sa référence
   */
  getByRef: async (ref: string): Promise<ApiResponse<Lead>> => {
    const response = await fetch(`${API_URL}/leads/ref/${ref}`);
    if (!response.ok) throw new Error("Erreur lors de la récupération du lead");
    return response.json();
  },

  /*
   Créer un nouveau lead
   */
  create: async (leadData: Partial<Lead>): Promise<ApiResponse<Lead>> => {
    const response = await fetch(`${API_URL}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadData),
    });
    if (!response.ok) throw new Error("Erreur lors de la création du lead");
    return response.json();
  },

  /*
   Mettre à jour un lead
   */
  update: async (
    id: string,
    leadData: Partial<Lead>,
  ): Promise<ApiResponse<Lead>> => {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadData),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour du lead");
    return response.json();
  },

  /*
   Supprimer un lead
   */
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_URL}/leads/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression du lead");
    return response.json();
  },

  /*
   Récupérer les statistiques des leads
   */
  getStats: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_URL}/leads/stats`);
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des statistiques");
    return response.json();
  },

  /*
   Marquer un SMS comme envoyé
   */
  markSmsAsSent: async (id: string): Promise<ApiResponse<Lead>> => {
    const response = await fetch(`${API_URL}/leads/${id}/sms`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour");
    return response.json();
  },

  /*
   Marquer un email comme envoyé
   */
  markEmailAsSent: async (id: string): Promise<ApiResponse<Lead>> => {
    const response = await fetch(`${API_URL}/leads/${id}/email`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour");
    return response.json();
  },
};

/*
 SERVICE IMPORT
 */
export const importApi = {
  /*
   Importer un fichier CSV
   */
  importCSV: async (file: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/import/csv`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Erreur lors de l'import du fichier");
    return response.json();
  },

  /*
   Télécharger un template CSV
   */
  downloadTemplate: async (): Promise<Blob> => {
    const response = await fetch(`${API_URL}/import/template`);
    if (!response.ok)
      throw new Error("Erreur lors du téléchargement du template");
    return response.blob();
  },
};

/*
 SERVICE HISTORIQUE
 */
export const historyApi = {
  /*
   Récupérer l'historique des imports
   */
  getAll: async (
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<ImportHistory>> => {
    const response = await fetch(
      `${API_URL}/history?page=${page}&limit=${limit}`,
    );
    if (!response.ok)
      throw new Error("Erreur lors de la récupération de l'historique");
    return response.json();
  },

  /*
   Récupérer un import par son ID
   */
  getById: async (id: string): Promise<ApiResponse<ImportHistory>> => {
    const response = await fetch(`${API_URL}/history/${id}`);
    if (!response.ok)
      throw new Error("Erreur lors de la récupération de l'import");
    return response.json();
  },

  /*
   Supprimer un enregistrement d'historique
   */
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_URL}/history/${id}`, {
      method: "DELETE",
    });
    if (!response.ok)
      throw new Error("Erreur lors de la suppression de l'historique");
    return response.json();
  },

  /*
   Récupérer les statistiques des imports
   */
  getStats: async (): Promise<ApiResponse> => {
    const response = await fetch(`${API_URL}/history/stats`);
    if (!response.ok)
      throw new Error("Erreur lors de la récupération des statistiques");
    return response.json();
  },
};
