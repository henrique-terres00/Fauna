import { create } from 'zustand';
import api from '../lib/api';

interface AuthResponse {
  token: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: async (username: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', { username, password });
      const { token } = response;
      
      localStorage.setItem('token', token);
      set({ token, isAuthenticated: true });
    } catch (error) {
      throw new Error('Falha na autenticação');
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
    window.location.href = '/'; // Redireciona para a home
  },
}));
