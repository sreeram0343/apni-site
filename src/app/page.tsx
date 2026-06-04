import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function IndexPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  if (session.user.role === "ADMIN") {
    redirect("/dashboard/admin");
  } else {
    redirect("/dashboard/supervisor");
  }
}
