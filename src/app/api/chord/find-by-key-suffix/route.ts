import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/firebase-server-config";
import { convertChordNotation } from "@/lib/music/helpers/convert-chord-notation";
import {
  DocumentData,
  Query,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { PAGE_LIMIT } from "@/consts";
import { ChordType } from "@/types/ui/chord";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const key = url.searchParams.get("key");
    const suffix = url.searchParams.get("suffix");
    const cursor = url.searchParams.get("cursor");
    console.log(
      `New Request: Fetching chord by ${key} and ${suffix}. Timestamp:${new Date()}`,
    );

    if (!key) {
      return NextResponse.json({ message: "Missing key" }, { status: 400 });
    }
    if (!suffix) {
      return NextResponse.json({ message: "Missing suffix" }, { status: 400 });
    }

    const cleanKey = convertChordNotation(key);
    const cleanSuffix = convertChordNotation(suffix);

    let queryRef: Query = db.collection("chords");

    if (key !== "all") {
      queryRef = queryRef.where("key", "==", cleanKey);
    }

    if (suffix !== "all") {
      queryRef = queryRef.where("suffix", "==", cleanSuffix);
    }

    queryRef = queryRef.orderBy("__name__");

    if (cursor) {
      const cursorDoc = await db.collection("chords").doc(cursor).get();
      if (cursorDoc.exists) {
        queryRef = queryRef.startAfter(cursorDoc);
      }
    }

    queryRef = queryRef.limit(PAGE_LIMIT);

    const snapshot = await queryRef.get();

    const chords: Partial<ChordType>[] = snapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>): Partial<ChordType> => {
        const data = doc.data();
        return {
          id: doc.id,
          key: data.key,
          suffix: data.suffix,
          positions: data.positions,
        };
      },
    );

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    return NextResponse.json({
      data: chords,
      nextCursor: lastDoc?.id ?? null,
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
