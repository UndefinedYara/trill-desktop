import * as admin from "firebase-admin";
import "dotenv/config";

// Decode the base64 service account JSON from env
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64!, "base64").toString(
    "utf8"
  )
);

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
