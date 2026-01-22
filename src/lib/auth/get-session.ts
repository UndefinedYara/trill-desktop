import { cookies } from "next/headers";
import { admin } from "@/lib/firebase/firebase-server-config";

export type SessionUser = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  memberSince?: Date;
};

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) return null;
  try {
    const decoded = await admin.auth().verifySessionCookie(session, true);

    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      memberSince: new Date(decoded.auth_time * 1000),
    };
  } catch (e) {
    return null;
  }
}
