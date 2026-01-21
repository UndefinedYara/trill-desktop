import { getSession } from "@/lib/auth/get-session";
import { admin } from "@/lib/firebase/firebase-server-config";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  if (user) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
