import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: "session",
    value: "",
    path: "/",
    httpOnly: true,
    maxAge: 0, // expire immediately
  });
  return res;
}
