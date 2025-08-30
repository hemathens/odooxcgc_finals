// API configuration and utilities
// Types
interface LoginRequest {
  email: string;
  password: string;
  role: 'student' | 'tpo' | 'company';
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'tpo' | 'company';
  company_name?: string;
}

interface GoogleLoginRequest {
  id_token: string;
  role: 'student' | 'tpo' | 'company';
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'tpo' | 'company';
  avatar_url?: string;
  provider: string;
  company_name?: string;
  is_active: boolean;
  created_at: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

const API_BASE_URL = 'http://localhost:8000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    console.log('API Request:', { url, method: config.method, headers: config.headers });

    try {
      const response = await fetch(url, config);
      console.log('API Response:', { status: response.status, statusText: response.statusText });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText || 'Network error' };
        }
        throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Success Response:', data);
      return data;
    } catch (error) {
      console.error('API Request Failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Make sure it\'s running on http://localhost:8000');
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async googleLogin(data: GoogleLoginRequest): Promise<AuthResponse> {
    return this.request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/api/auth/me');
  }

  async logout(): Promise<{ message: string }> {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  async getUserProfile(): Promise<User> {
    return this.request('/api/users/profile');
  }

  // Application endpoints
  async getApplications(): Promise<any[]> {
    return this.request('/api/applications');
  }

  // Test endpoints
  async getTests(): Promise<any[]> {
    return this.request('/api/tests');
  }

  // Notification endpoints
  async getNotifications(): Promise<any[]> {
    return this.request('/api/notifications');
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
