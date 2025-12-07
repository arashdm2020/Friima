// API Client for FARIIMA Backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface ApiError {
  error: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('jwt_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'Network error',
      }));
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  }

  // Authentication
  async getNonce(address: string): Promise<{ nonce: string }> {
    return this.request('/auth/nonce', {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  async login(
    address: string,
    signature: string,
    nonce: string
  ): Promise<{ token: string; user: any }> {
    const result = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ address, signature, nonce }),
    });
    
    this.setToken(result.token);
    return result;
  }

  // Users
  async getCurrentUser(): Promise<any> {
    return this.request('/users/me');
  }

  async updateProfile(updates: any): Promise<any> {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async getUserByAddress(address: string): Promise<any> {
    return this.request(`/users/${address}`);
  }

  // Projects
  async createProject(project: any): Promise<any> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async getProject(id: string): Promise<any> {
    return this.request(`/projects/${id}`);
  }

  async updateProject(id: string, updates: any): Promise<any> {
    return this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async searchProjects(query: string, category?: string): Promise<any> {
    const params = new URLSearchParams({ q: query });
    if (category) params.append('category', category);
    return this.request(`/search/projects?${params}`);
  }

  // Escrow
  async getEscrow(projectId: string): Promise<any> {
    return this.request(`/escrow/${projectId}`);
  }

  async getEscrowHistory(projectId: string): Promise<any> {
    return this.request(`/escrow/${projectId}/history`);
  }

  // Disputes
  async createDispute(dispute: any): Promise<any> {
    return this.request('/disputes', {
      method: 'POST',
      body: JSON.stringify(dispute),
    });
  }

  async getDispute(id: string): Promise<any> {
    return this.request(`/disputes/${id}`);
  }

  async listDisputes(status?: string): Promise<any> {
    const params = status ? `?status=${status}` : '';
    return this.request(`/disputes${params}`);
  }

  async voteOnDispute(id: string, vote: any): Promise<any> {
    return this.request(`/disputes/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify(vote),
    });
  }

  // NFTs
  async getUserNFTs(address: string): Promise<any> {
    return this.request(`/nfts/user/${address}`);
  }

  async getNFT(tokenId: number): Promise<any> {
    return this.request(`/nfts/${tokenId}`);
  }

  // IPFS
  async uploadToIPFS(file: File): Promise<{ hash: string; url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/ipfs/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload to IPFS');
    }

    return response.json();
  }

  // Analytics
  async getPlatformStats(): Promise<any> {
    return this.request('/analytics/platform');
  }

  async getUserStats(address: string): Promise<any> {
    return this.request(`/analytics/user/${address}`);
  }
}

export const api = new ApiClient(API_URL);
export default api;
