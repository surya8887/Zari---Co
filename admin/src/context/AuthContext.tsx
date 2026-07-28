import React, { createContext, useContext, useState } from "react";
import { api } from "../api";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  role: string;
  phone?: string | null;
  isVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("zari_admin_user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.login(email, password);
      // The response payload from backend contains { user, accessToken, refreshToken }
      const userData = response.user;

      if (!userData) {
        throw new Error("Invalid response format from authentication node.");
      }

      if (!["admin", "superadmin"].includes(userData.role)) {
        throw new Error("Access Denied: You do not possess administrator credentials.");
      }

      setUser(userData);
      localStorage.setItem("zari_admin_user", JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    setLoading(true);
    try {
      const response = await api.register(payload);
      const userData = response.user;

      if (!userData) {
        throw new Error("Invalid response format from registration node.");
      }

      setUser(userData);
      localStorage.setItem("zari_admin_user", JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    setLoading(true);
    try {
      const response = await api.googleLogin(idToken);
      const userData = response.user;

      if (!userData) {
        throw new Error("Invalid response format from authentication node.");
      }

      if (!["admin", "superadmin"].includes(userData.role)) {
        throw new Error("Access Denied: You do not possess administrator credentials.");
      }

      setUser(userData);
      localStorage.setItem("zari_admin_user", JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
    } catch (error) {
      console.warn("Backend logout session unlinking was not acknowledged:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("zari_admin_user");
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loginWithGoogle, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
