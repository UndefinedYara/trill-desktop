import { admin, db } from "../src/lib/firebase/firebase-server-config";

async function testFirebase() {
  try {
    console.log("--- Starting Firebase Connection Test ---");

    // Firebase Admin App
    const appName = admin.app().name;
    const projectIdFromSdk = admin.app().options.projectId;

    console.log("Firebase App initialized:", appName);
    console.log(
      "Project ID from service account:",
      projectIdFromSdk ?? "not set"
    );

    if (!projectIdFromSdk) {
      console.warn(
        "⚠ Project ID is undefined. Check that your service account JSON is correct."
      );
    }

    // List all collections in Firestore
    const collections = await db.listCollections();
    console.log("Collections in Firestore:");
    collections.forEach((col) => console.log(" -", col.id));

    // Attempt to read documents from 'user' collection
    const userCollectionRef = db.collection("user");
    const snapshot = await userCollectionRef.listDocuments();
    console.log("All document IDs in 'user' collection:");
    snapshot.forEach((doc) => console.log(" -", `"${doc.id}"`));

    // Show first 5 documents in 'user' collection
    const userSnapshot = await userCollectionRef.limit(5).get();
    console.log(
      `Number of documents in 'user' collection: ${userSnapshot.size}`
    );
    userSnapshot.forEach((doc) =>
      console.log(` - doc id: ${doc.id}, data:`, doc.data())
    );

    // Optionally fetch a specific test document
    const testDocId = "8TRGzR7sIGd15z8xq6xu"; // replace with an actual doc ID
    const docRef = userCollectionRef.doc(testDocId);
    try {
      const doc = await docRef.get();
      if (!doc.exists) {
        console.warn(
          `⚠ Test document '${testDocId}' does not exist (expected if not created).`
        );
      } else {
        console.log("Test document exists:", doc.data());
      }
    } catch (docError) {
      console.error(`❌ Error fetching document '${testDocId}':`, docError);
    }

    console.log("--- Firebase Connection Test COMPLETED ---");
    console.log(
      "✅ Successfully connected to Firestore and inspected collections/documents."
    );
  } catch (error) {
    console.error("--- Firebase Connection Test FAILED ---");
    console.error(error);
  }
}

testFirebase();
