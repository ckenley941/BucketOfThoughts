const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7037/';

export const apiClient = {
  get: async <T>(endpoint: string, token?: string): Promise<T> => {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.errorMessage || "Server error"}`);
    }
    return await response.json();
  },
  post: async <T>(endpoint: string, data: unknown, token?: string): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.errorMessage || "Server error"}`);
    }
    return await response.json();
  },
  put: async <T>(endpoint: string, data: unknown, token?: string): Promise<T> => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.errorMessage || "Server error"}`);
    }
    return await response.json();
  },
  delete: async <T>(endpoint: string, token?: string): Promise<T> => {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API Error: ${error.errorMessage || "Server error"}`);
    }
    return await response.json();
  },
};

