const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiService {
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
}
