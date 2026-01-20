import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/lib/firebase/firebase-server-config"; // your Admin SDK init

// Set cookie expiration, e.g., 5 days
const SESSION_EXPIRES_IN = 5 * 24 * 60 * 60 * 1000; // 5 days in ms

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json(
        { error: "No ID token provided" },
        { status: 400 },
      );
    }

    // Create a session cookie from the ID token
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn: SESSION_EXPIRES_IN });

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: "session",
      value: sessionCookie,
      httpOnly: true,
      path: "/",
      maxAge: SESSION_EXPIRES_IN / 1000, // in seconds
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;
  } catch (error: unknown) {
    console.error("Error creating session cookie:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}
