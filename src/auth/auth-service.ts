import { AuthUser } from "./auth-types";

export const SESSION_COOKIE_NAME = "apni_site_session";

// Client-side cookie utilities
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
}

function eraseCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
}

// Demo users list
export const demoUsers: Record<string, Omit<AuthUser, "authenticated">> = {
  "admin@apnisite.com": {
    id: "builder-admin-id",
    name: "Builder Admin",
    email: "admin@apnisite.com",
    role: "BUILDER_ADMIN",
  },
  "supervisor@apnisite.com": {
    id: "site-supervisor-id",
    name: "Site Supervisor",
    email: "supervisor@apnisite.com",
    role: "SITE_SUPERVISOR",
  },
  "sup2@apnisite.com": {
    id: "site-supervisor-2-id",
    name: "Site Supervisor 2",
    email: "sup2@apnisite.com",
    role: "SITE_SUPERVISOR",
  },
};

export const demoPasswords: Record<keyof typeof demoUsers, string> = {
  "admin@apnisite.com": "password123",
  "supervisor@apnisite.com": "password123",
  "sup2@apnisite.com": "password123",
};

// Centralized Auth Service
export const authService = {
  /**
   * Client-side method to retrieve current user session.
   */
  getClientSession(): AuthUser | null {
    try {
      const cookieValue = getCookie(SESSION_COOKIE_NAME);
      if (!cookieValue) return null;
      return JSON.parse(decodeURIComponent(cookieValue)) as AuthUser;
    } catch {
      return null;
    }
  },

  /**
   * Client-side method to store user session.
   */
  setClientSession(user: AuthUser) {
    setCookie(SESSION_COOKIE_NAME, encodeURIComponent(JSON.stringify(user)));
    if (typeof window !== "undefined") {
      localStorage.setItem("apni_site_user", JSON.stringify(user));
    }
  },

  /**
   * Client-side method to clear user session.
   */
  clearClientSession() {
    eraseCookie(SESSION_COOKIE_NAME);
    if (typeof window !== "undefined") {
      localStorage.removeItem("apni_site_user");
    }
  },
};
