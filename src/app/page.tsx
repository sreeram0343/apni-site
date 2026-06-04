import { getServerSession } from "@/auth/server-session";
import { redirect } from "next/navigation";

export default async function IndexPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "BUILDER_ADMIN") {
    redirect("/dashboard/admin");
  } else {
    redirect("/dashboard/supervisor");
  }
}
