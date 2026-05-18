import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type User, userSchema } from '@/features/auth/validation';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  signupWithEmail: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  clearAuthState: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signupWithEmail: async (firstName, lastName, email, password, phone) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.register({ firstName, lastName, email, password, phone });
          const result = userSchema.safeParse(user);
          if (result.success) {
            set({ user: result.data, isAuthenticated: true, error: null });
            return { success: true };
          } else {
            console.error('Invalid user data received during registration:', result.error);
            const errMsg = "Registration succeeded but user profile was invalid";
            set({ user: null, isAuthenticated: false, error: errMsg });
            return { success: false, error: errMsg };
          }
        } catch (err: any) {
          const errMsg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Registration failed";
          set({ error: errMsg });
          return { success: false, error: errMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithEmail: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.login({ email, password });
          const result = userSchema.safeParse(user);
          if (result.success) {
            set({ user: result.data, isAuthenticated: true, error: null });
            return { success: true };
          } else {
            console.error('Invalid user data received during login:', result.error);
            const errMsg = "Login succeeded but user profile was invalid";
            set({ user: null, isAuthenticated: false, error: errMsg });
            return { success: false, error: errMsg };
          }
        } catch (err: any) {
          const errMsg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Login failed";
          set({ error: errMsg });
          return { success: false, error: errMsg };
        } finally {
          set({ isLoading: false });
        }
      },

      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        return new Promise((resolve) => {
          setTimeout(() => {
            const isSuccess = Math.random() > 0.15;
            if (isSuccess) {
              const mockGoogleUser: User = {
                id: "00000000-0000-0000-0000-000000000000",
                email: "google.user@example.com",
                firstName: "Google",
                lastName: "User",
                role: "user",
                isVerified: true
              };
              set({ user: mockGoogleUser, isAuthenticated: true, isLoading: false, error: null });
              resolve({ success: true });
            } else {
              const errMsg = "Google authentication failed. Please try again.";
              set({ isLoading: false, error: errMsg });
              resolve({ success: false, error: errMsg });
            }
          }, 1200);
        });
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
        } catch (err) {
          console.error("Logout API error (clearing local state anyway):", err);
        } finally {
          get().clearAuthState();
        }
      },

      setUser: (user) => {
        if (user) {
          const result = userSchema.safeParse(user);
          if (result.success) {
            set({ user: result.data, isAuthenticated: true });
          } else {
            console.error('Invalid user data in setUser:', result.error);
            set({ user: null, isAuthenticated: false });
          }
        } else {
          set({ user: null, isAuthenticated: false });
        }
      },

      clearAuthState: () => {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false, error: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
