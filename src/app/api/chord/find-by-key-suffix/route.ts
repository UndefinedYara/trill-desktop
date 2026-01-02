import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-server-config";
import { convertChordNotation } from "@/lib/music/helpers/convertChordNotation";
import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { ChordType } from "@/types/ui/chord";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const suffix = url.searchParams.get("suffix");

    if (!key) {
      return NextResponse.json({ message: "Missing key" }, { status: 400 });
    }
    if (!suffix) {
      return NextResponse.json({ message: "Missing suffix" }, { status: 400 });
    }

    const chordsRef = db.collection("chords");
    const cleanKey = convertChordNotation(key);
    const cleanSuffix = convertChordNotation(suffix);

    let queryRef: Query = chordsRef;

    queryRef = queryRef.where("key", "==", cleanKey);
    queryRef = queryRef.where("suffix", "==", cleanSuffix);

    const snapshot = await queryRef.get();
    if (snapshot.empty) {
      throw new Error("Chord collection not found or empty.");
    }
    const chords: ChordType[] = snapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>): ChordType => {
        const data = doc.data();
        return {
          id: doc.id,
          key: data.key,
          suffix: data.suffix,
          frets: data.frets,
          barres: data.barres,
          capo: data.capo,
          fingers: data.fingers,
          baseFret: data.baseFret,
          positions: data.positions,
        };
      }
    );
    return NextResponse.json({ data: chords });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
