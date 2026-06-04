"use client";

import React, { useState, useEffect } from "react";
import { AuthUser } from "./auth-types";
import { AuthContext } from "./auth-context";
import { authService } from "./auth-service";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Restore session on app load
    const restoreSession = () => {
      try {
        let session = authService.getClientSession();
        
        // Fallback to localStorage if cookie is gone but localStorage has it
        if (!session && typeof window !== "undefined") {
          const localUser = localStorage.getItem("apni_site_user");
          if (localUser) {
            try {
              session = JSON.parse(localUser) as AuthUser;
              // Restore cookie if we have localStorage user
              if (session) {
                authService.setClientSession(session);
              }
            } catch (err) {
              console.error("Failed to parse local storage session:", err);
            }
          }
        }
        
        setUser(session);
      } catch (e) {
        console.error("Failed to restore session:", e);
        setError("Failed to restore active session");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (userData: AuthUser) => {
    authService.setClientSession(userData);
    setUser(userData);
  };

  const logout = () => {
    authService.clearClientSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
