import { DocumentData, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { db } from "./firebase-server-config";

export async function getChordKeys() {
  const snap = await db.collection("keys").get();
  if (snap.empty) {
    throw new Error("Chord keys collection not found or empty.");
  }
  return snap.docs.flatMap(
    (doc: QueryDocumentSnapshot<DocumentData>) => doc.data().values
  );
}

export async function getChordSuffixes() {
  const snap = await db.collection("suffixes").get();
  if (snap.empty) {
    throw new Error("Chord suffixes collection not found or empty.");
  }
  return snap.docs.flatMap(
    (doc: QueryDocumentSnapshot<DocumentData>) => doc.data().values
  );
}
