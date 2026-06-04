"use server";

import { signIn, signOut } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    // NextAuth v5 expects credentials provider sign in
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "Authentication failed" };
      }
    }
    // We must throw the error so Next.js redirects work properly (NextJS redirects use thrown errors)
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
