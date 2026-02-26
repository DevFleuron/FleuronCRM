const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiService {
  /**
   * Helper centralisé — credentials: "include" sur toutes les requêtes
   */
  private static async fetchApi(
    url: string,
    options: RequestInit = {},
  ): Promise<any> {
    const isFormData = options.body instanceof FormData;

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      credentials: "include",
      headers: isFormData
        ? undefined // Laisser le browser gérer le Content-Type pour FormData
        : {
            "Content-Type": "application/json",
            ...options.headers,
          },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error("Le serveur a retourné du HTML au lieu de JSON");
    }

    return response.json();
  }

  /**
   * LEADS
   */
  static async getLeads(filters?: any) {
    const params = filters ? new URLSearchParams(filters).toString() : "";
    return this.fetchApi(`/api/leads?${params}`);
  }

  static async getLeadById(id: string) {
    return this.fetchApi(`/api/leads/${id}`);
  }

  static async updateLead(id: string, data: any) {
    return this.fetchApi(`/api/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * IMPORT CSV
   */
  static async importCSV(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.fetchApi(`/api/import/csv`, {
      method: "POST",
      body: formData,
    });
  }

  /**
   * TEMPLATES
   */
  static async getTemplates(type?: "sms" | "email") {
    const params = type ? `?type=${type}` : "";
    return this.fetchApi(`/api/templates${params}`);
  }

  static async createTemplate(data: any) {
    return this.fetchApi(`/api/templates`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async updateTemplate(id: string, data: any) {
    return this.fetchApi(`/api/templates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteTemplate(id: string) {
    return this.fetchApi(`/api/templates/${id}`, {
      method: "DELETE",
    });
  }

  /**
   * CAMPAIGNS
   */
  static async getCampaigns() {
    return this.fetchApi(`/api/campaigns`);
  }

  static async createCampaign(data: any) {
    return this.fetchApi(`/api/campaigns`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getCampaignById(id: string) {
    return this.fetchApi(`/api/campaigns/${id}`);
  }

  /**
   * IMPORT HISTORY
   */
  static async getImportHistory() {
    return this.fetchApi(`/api/history`);
  }

  static async getImportById(id: string) {
    return this.fetchApi(`/api/history/${id}`);
  }

  /**
   * STATS / DASHBOARD
   */
  static async getDashboardStats() {
    return this.fetchApi(`/api/stats/dashboard`);
  }

  /**
   * SEQUENCES
   */
  static async getSequences() {
    return this.fetchApi(`/api/sequences`);
  }

  static async createSequence(data: {
    name: string;
    steps: Array<{
      type: "sms" | "email";
      templateId: string;
      delayDays: number;
    }>;
    leadIds: string[];
  }) {
    return this.fetchApi(`/api/sequences`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getSequenceById(id: string) {
    return this.fetchApi(`/api/sequences/${id}`);
  }

  static async stopSequence(id: string) {
    return this.fetchApi(`/api/sequences/${id}/stop`, {
      method: "POST",
    });
  }

  /**
   * EXPORT
   */
  static async exportLeadsCSV(filters?: any) {
    const response = await fetch(`${API_URL}/api/export/csv`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filters }),
    });

    if (!response.ok) throw new Error("Erreur lors de l'export");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  static async exportLeadsExcel(filters?: any) {
    const response = await fetch(`${API_URL}/api/export/excel`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filters }),
    });

    if (!response.ok) throw new Error("Erreur lors de l'export");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${Date.now()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /**
   * UPLOAD
   */
  static async uploadAttachment(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return this.fetchApi(`/api/upload/attachment`, {
      method: "POST",
      body: formData,
    });
  }

  static async deleteAttachment(filename: string) {
    return this.fetchApi(`/api/upload/attachment/${filename}`, {
      method: "DELETE",
    });
  }

  /**
   * AUTH
   */
  static async login(email: string, password: string) {
    return this.fetchApi(`/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  static async logout() {
    return this.fetchApi(`/api/auth/logout`, {
      method: "POST",
    });
  }

  static async getMe() {
    return this.fetchApi(`/api/auth/me`);
  }

  /**
   * USERS (admin)
   */
  static async getUsers() {
    return this.fetchApi(`/api/auth/users`);
  }

  static async createUser(data: {
    email: string;
    password: string;
    name: string;
    role: string;
  }) {
    return this.fetchApi(`/api/auth/users`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async deleteUser(id: string) {
    return this.fetchApi(`/api/auth/users/${id}`, {
      method: "DELETE",
    });
  }
}
