"use server";

import { admin } from "@/lib/firebase/firebase-server-config";
import { cookies } from "next/headers";

const SESSION_EXPIRES_IN = 5 * 24 * 60 * 60 * 1000; // 5 days in ms

export async function createSession(idToken: string) {
  if (!idToken) {
    throw new Error("No ID token provided");
  }

  // Create a session cookie from the ID token
  const sessionCookie = await admin
    .auth()
    .createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN });

  // Set the cookie using Next.js headers
  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: sessionCookie,
    httpOnly: true,
    path: "/",
    maxAge: SESSION_EXPIRES_IN / 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}
