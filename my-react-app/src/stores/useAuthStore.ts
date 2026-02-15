import { create } from 'zustand';
import { User, AuthState } from '@types/index';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  reset: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  ...initialState,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, isAuthenticated: false, error: null }),
  reset: () => set(initialState),
}));
