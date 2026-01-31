import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = Cookies.get('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (res.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login'; // Auto redirect if session expired
    }

    return res;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};