import { useAuthStore } from "@/store/useAuthStore";  
import type { LoginInput, RegisterInput } from "@/features/auth/validation";

export const useAuth = () => {
  const store = useAuthStore();

  const login = async (data: LoginInput) => {
    return store.loginWithEmail(data.email, data.password);
  };

  const register = async (data: RegisterInput) => {
    return store.signupWithEmail(
      data.firstName,
      data.lastName,
      data.email,
      data.password,
      data.phone
    );
  };

  const logout = async () => {
    await store.logout();
  };

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login,
    register,
    logout,
    loginWithGoogle: store.loginWithGoogle,
  };
};
