const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiService {
  /**
   * Helper pour gérer les réponses API
   */
  private static async handleResponse(response: Response) {
    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      throw new Error("Le serveur a retourné du HTML au lieu de JSON");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur API");
    }

    return data;
  }

  /**
   * LEADS
   */
  static async getLeads(filters?: any) {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/api/leads?${params}`);
    return response.json();
  }

  static async getLeadById(id: string) {
    const response = await fetch(`${API_URL}/api/leads/${id}`);
    return response.json();
  }

  static async updateLead(id: string, data: any) {
    const response = await fetch(`${API_URL}/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  /**
   * IMPORT CSV
   */
  static async importCSV(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/api/import/csv`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  }

  /**
   * TEMPLATES
   */
  static async getTemplates(type?: "sms" | "email") {
    const params = type ? `?type=${type}` : "";
    const response = await fetch(`${API_URL}/api/templates${params}`);
    return response.json();
  }

  static async createTemplate(data: any) {
    const response = await fetch(`${API_URL}/api/templates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async updateTemplate(id: string, data: any) {
    const response = await fetch(`${API_URL}/api/templates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async deleteTemplate(id: string) {
    const response = await fetch(`${API_URL}/api/templates/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }

  /**
   * CAMPAIGNS
   */
  static async getCampaigns() {
    const response = await fetch(`${API_URL}/api/campaigns`);
    return response.json();
  }

  static async createCampaign(data: any) {
    const response = await fetch(`${API_URL}/api/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  static async getCampaignById(id: string) {
    const response = await fetch(`${API_URL}/api/campaigns/${id}`);
    return response.json();
  }

  /**
   * IMPORT HISTORY
   */
  static async getImportHistory() {
    const response = await fetch(`${API_URL}/api/history`);
    return response.json();
  }

  static async getImportById(id: string) {
    const response = await fetch(`${API_URL}/api/history/${id}`);
    return response.json();
  }

  /**
   * STATS / DASHBOARD
   */
  static async getDashboardStats() {
    const response = await fetch(`${API_URL}/api/stats/dashboard`);
    return response.json();
  }

  /**
   * SEQUENCES
   */
  static async getSequences() {
    const response = await fetch(`${API_URL}/api/sequences`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await this.handleResponse(response);
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
    const response = await fetch(`${API_URL}/api/sequences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await this.handleResponse(response);
  }

  static async getSequenceById(id: string) {
    const response = await fetch(`${API_URL}/api/sequences/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await this.handleResponse(response);
  }

  static async stopSequence(id: string) {
    const response = await fetch(`${API_URL}/api/sequences/${id}/stop`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await this.handleResponse(response);
  }
  /**
   * EXPORT
   */
  static async exportLeadsCSV(filters?: any) {
    const response = await fetch(`${API_URL}/api/export/csv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filters }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'export");
    }

    // Télécharger le fichier
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filters }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'export");
    }

    // Télécharger le fichier
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
}
