"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ApiService } from "@/src/lib/api";
import type { User, AuthContextType } from "@/src/types";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Vérifier la session au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await ApiService.getMe();
      if (response.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await ApiService.login(email, password);

    if (response.success) {
      setUser(response.data.user);
      router.push("/dashboard");
      router.refresh(); // Force le middleware à re-vérifier
    } else {
      throw new Error(response.message || "Erreur de connexion");
    }
  };

  const logout = async () => {
    await ApiService.logout();
    setUser(null);
    router.push("/login");
    router.refresh(); // Force le middleware à re-vérifier
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
