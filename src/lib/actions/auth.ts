"use server";

import { signIn, signOut } from "@/lib/auth";
import { cookies } from "next/headers";

export async function loginWithGoogleAction(role: "ADMIN" | "SUPERVISOR") {
  const cookieStore = await cookies();
  cookieStore.set("signup_role", role, {
    maxAge: 60 * 10, // 10 minutes
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  
  await signIn("google", { redirectTo: "/" });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
