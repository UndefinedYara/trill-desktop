import { db } from "./firebase-server-config";

export async function getChordKeys() {
  const snap = await db.collection("keys").get();
  return snap.docs.flatMap((doc) => doc.data().values);
}

export async function getChordSuffixes() {
  const snap = await db.collection("suffixes").get();
  return snap.docs.flatMap((doc) => doc.data().values);
}
