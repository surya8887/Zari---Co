import { useState } from "react";
import { useAuthStore } from "../store/authStore";  
import { authService } from "../services/auth.service";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema";

export const useAuth = () => {
  const { setUser, logout: clearStore, user, isAuthenticated } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.login(data);
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await authService.register(data);
      setUser(user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearStore();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };
};
