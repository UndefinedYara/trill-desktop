import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-server-config"; // admin SDK
import { convertChordNotation } from "@/lib/music/helpers/convertChordNotation";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const suffix = url.searchParams.get("suffix");

    const chordsRef = db.collection("chords");
    const cleanKey = convertChordNotation(key!);
    const cleanSuffix = convertChordNotation(suffix!);
    // Add filters only if they exist
    const queryRef = key
      ? suffix
        ? chordsRef
            .where("key", "==", cleanKey)
            .where("suffix", "==", cleanSuffix)
        : chordsRef.where("key", "==", cleanKey)
      : cleanSuffix
      ? chordsRef.where("suffix", "==", cleanSuffix)
      : chordsRef;

    const snapshot = await queryRef.get();

    const chords = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ data: chords });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
