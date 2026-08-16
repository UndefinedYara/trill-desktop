"use server";
import { db } from "@/lib/firebase/firebase-server-config";
import { DocumentData, QueryDocumentSnapshot, Query } from "firebase-admin/firestore";
import { convertChordNotation } from "@/lib/music/helpers/convert-chord-notation";
import { PAGE_LIMIT } from "@/consts";
import { ChordType } from "@/types/ui/chord";

export async function getChordKeys() {
  const snap = await db.collection("keys").get();
  if (snap.empty) {
    throw new Error("Chord keys collection not found or empty.");
  }
  return snap.docs.flatMap(
    (doc: QueryDocumentSnapshot<DocumentData>) => doc.data().values,
  );
}

export async function getChordSuffixes() {
  const snap = await db.collection("suffixes").get();
  if (snap.empty) {
    throw new Error("Chord suffixes collection not found or empty.");
  }
  return snap.docs.flatMap(
    (doc: QueryDocumentSnapshot<DocumentData>) => doc.data().values,
  );
}

export async function findChordsByKeyAndSuffix(key: string, suffix: string, cursor?: string | null) {
  if (!key || !suffix) {
    throw new Error("Missing key or suffix");
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

  const chords: ChordType[] = snapshot.docs.map(
    (doc: QueryDocumentSnapshot<DocumentData>): ChordType => {
      const data = doc.data();
      return {
        id: doc.id,
        key: data.key,
        suffix: data.suffix,
        positions: data.positions || [],
        description: data.description || "",
        barres: data.barres || [],
        baseFret: data.baseFret || 0,
        fingers: data.fingers || [],
        frets: data.frets || [],
        capo: data.capo || false,
      };
    },
  );

  const lastDoc = snapshot.docs[snapshot.docs.length - 1];

  return {
    data: chords,
    nextCursor: lastDoc?.id ?? null,
  };
}
