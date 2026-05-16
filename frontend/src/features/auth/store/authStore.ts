import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User, userSchema } from '../schemas/auth.schema';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
}

/**
 * Auth Store using Zustand with Zod validation for the user state
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        if (user) {
          // Validate the user object against our schema
          const result = userSchema.safeParse(user);
          if (result.success) {
            set({ user: result.data, isAuthenticated: true });
          } else {
            console.error('Invalid user data for state:', result.error);
            set({ user: null, isAuthenticated: false });
          }
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // persist to localStorage
    }
  )
);
