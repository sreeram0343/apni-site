"use server";

import { cookies } from "next/headers";
import { demoPasswords, demoUsers, SESSION_COOKIE_NAME } from "@/auth/auth-service";
import { AuthUser } from "@/auth/auth-types";
import { db } from "@/lib/db";

export async function loginAction(formData: Record<string, string>) {
  const { email, password } = formData;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const demoUser = demoUsers[normalizedEmail];
  const expectedPassword = demoPasswords[normalizedEmail];

  if (!demoUser || password !== expectedPassword) {
    return { error: "Invalid email or password." };
  }

  const user: AuthUser = {
    ...demoUser,
    authenticated: true,
  };

  try {
    // Automatically provision user in the database (Self-seeding)
    await db.user.upsert({
      where: { email: normalizedEmail },
      update: {
        name: demoUser.name,
        role: demoUser.role,
      },
      create: {
        id: demoUser.id,
        name: demoUser.name,
        email: normalizedEmail,
        role: demoUser.role,
      },
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, encodeURIComponent(JSON.stringify(user)), {
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return { success: true, user };
  } catch (err) {
    console.error("Login action error:", err);
    return { error: "Failed to create session on server." };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { success: true };
  } catch (err) {
    console.error("Logout action error:", err);
    return { error: "Failed to destroy session on server." };
  }
}
