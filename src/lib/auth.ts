import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";
import { cookies } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  ...authConfig,
  providers: [
    ...authConfig.providers,
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        const cookieStore = await cookies();
        const signupRole = cookieStore.get("signup_role")?.value;

        if (signupRole && (signupRole === "ADMIN" || signupRole === "SUPERVISOR")) {
          const dbUser = await db.user.findUnique({ where: { email: user.email } });
          if (dbUser) {
            // Detect if user was newly created (within last 15 seconds)
            const isNewUser = dbUser.createdAt.getTime() > Date.now() - 15000;
            if (isNewUser) {
              await db.user.update({
                where: { id: dbUser.id },
                data: { role: signupRole },
              });
              user.role = signupRole;
            }
          }
          // Clean up the cookie
          cookieStore.delete("signup_role");
        }
      } catch (err) {
        console.error("Error setting role during signIn callback:", err);
      }
      return true;
    },
  },
  session: { strategy: "jwt" },
});
