import * as admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Build absolute path based on project root
const serviceAccountPath = path.resolve(
  process.cwd(),
  "src/lib/firebase/service-account.json"
);

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const chordsCollection = db.collection("chords");
const suffixesCollection = db.collection("suffixes");
const keysCollection = db.collection("keys");

export { admin, db, chordsCollection, suffixesCollection, keysCollection };
