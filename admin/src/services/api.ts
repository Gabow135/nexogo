const API_BASE_URL = 'http://127.0.0.1:8000/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth-token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth-token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth-token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || `HTTP ${response.status}`,
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0, error);
    }
  }

  // Authentication
  async login(username: string, password: string) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (data.token) {
      this.setToken(data.token);
    }
    
    return data;
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } finally {
      this.clearToken();
    }
  }

  async getMe() {
    return await this.request('/auth/me');
  }

  // Dashboard
  async getDashboardStats() {
    return await this.request('/admin/stats/dashboard');
  }

  // Activities
  async getActivities() {
    return await this.request('/admin/activities');
  }

  async getActivity(id: string) {
    return await this.request(`/admin/activities/${id}`);
  }

  async createActivity(activity: any) {
    return await this.request('/admin/activities', {
      method: 'POST',
      body: JSON.stringify(activity),
    });
  }

  async updateActivity(id: string, activity: any) {
    return await this.request(`/admin/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activity),
    });
  }

  async deleteActivity(id: string) {
    return await this.request(`/admin/activities/${id}`, {
      method: 'DELETE',
    });
  }

  async drawActivity(id: string) {
    return await this.request(`/admin/activities/${id}/draw`, {
      method: 'POST'
    });
  }

  // Winners
  async getWinners() {
    return await this.request('/admin/winners');
  }

  async toggleInstagramAnnouncement(id: string) {
    return await this.request(`/admin/winners/${id}/toggle-instagram`, {
      method: 'POST'
    });
  }

  // Bank Accounts
  async getBankAccounts() {
    return await this.request('/admin/bank-accounts');
  }

  async createBankAccount(data: any) {
    return await this.request('/admin/bank-accounts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateBankAccount(id: string, data: any) {
    return await this.request(`/admin/bank-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteBankAccount(id: string) {
    return await this.request(`/admin/bank-accounts/${id}`, {
      method: 'DELETE'
    });
  }

  // Orders
  async getOrders() {
    return await this.request('/admin/orders');
  }

  async getOrder(id: string) {
    return await this.request(`/admin/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return await this.request(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ estado: status }),
    });
  }

  // Lucky Numbers
  async getLuckyNumbers(activityId: number) {
    return await this.request(`/admin/activities/${activityId}/winners-by-number`);
  }

  async assignWinner(activityId: number, data: {
    numero_ganador: string;
    order_id: number;
    notas?: string;
  }) {
    return await this.request(`/admin/activities/${activityId}/assign-winner`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async executeAutomaticRaffle(activityId: number) {
    return await this.request(`/admin/activities/${activityId}/execute-raffle`, {
      method: 'POST'
    });
  }

  async assignMainWinner(activityId: number) {
    return await this.request(`/admin/activities/${activityId}/assign-main-winner`, {
      method: 'POST'
    });
  }

  async markAsFinished(activityId: number) {
    return await this.request(`/admin/activities/${activityId}/mark-as-finished`, {
      method: 'POST'
    });
  }
}

export const apiService = new ApiService();
export { ApiError };