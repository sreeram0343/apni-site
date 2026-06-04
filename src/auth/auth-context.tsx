"use client";

import { createContext, useContext } from "react";
import { AuthUser, AuthState } from "./auth-types";

export interface AuthContextType extends AuthState {
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
