export type UserRole = "BUILDER_ADMIN" | "SITE_SUPERVISOR";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  authenticated: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}
