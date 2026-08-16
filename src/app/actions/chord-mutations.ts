"use server";

import { db } from "@/lib/firebase/firebase-server-config";
import { ChordDocument } from "@/types/domain/chord-document";

export async function saveChord(chord: ChordDocument) {
  const snap = await db.collection("chords").add(chord);
  return snap.id;
}
