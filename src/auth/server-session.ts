import { cookies } from "next/headers";
import { AuthUser } from "./auth-types";
import { SESSION_COOKIE_NAME } from "./auth-service";

export async function getServerSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!cookie?.value) return null;

    const user = JSON.parse(decodeURIComponent(cookie.value)) as AuthUser;
    return user?.authenticated ? user : null;
  } catch {
    return null;
  }
}
