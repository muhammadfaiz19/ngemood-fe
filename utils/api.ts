import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Fetch wrapper with automatic authentication and error handling
 */
export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = Cookies.get('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, { 
      ...options, 
      headers 
    });

    // Handle unauthorized - redirect to login
    if (res.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    // Handle other errors
    if (!res.ok && res.status !== 404) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${res.status}`);
    }

    return res;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

/**
 * Helper untuk fetch data dengan type safety
 */
export const fetchJson = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const res = await fetchWithAuth(endpoint, options);
  return res.json();
};