import { admin, db } from "../src/lib/firebase/firebase-server-config";

async function testFirebase() {
  try {
    console.log("--- Starting Firebase Connection Test ---");

    // Firebase app info
    console.log("Firebase App initialized:", admin.app().name);

    const projectIdFromEnv = process.env.FIREBASE_PROJECT_ID;
    const projectIdFromSdk = admin.app().options.projectId;

    console.log("Project ID from env:", projectIdFromEnv);
    console.log("Project ID from SDK:", projectIdFromSdk);

    if (!projectIdFromEnv || projectIdFromEnv !== projectIdFromSdk) {
      console.warn(
        "⚠ Warning: Project ID mismatch. Your service account might be for a different project!"
      );
    }

    const snapshot = await db.collection("user").listDocuments();
    console.log("All document IDs in 'user' collection:");
    snapshot.forEach((doc) => console.log(" -", `"${doc.id}"`));

    // List collections in the database
    const collections = await db.listCollections();
    console.log("Collections in Firestore:");
    collections.forEach((col) => console.log(" -", col.id));

    // Check if the 'user' collection exists
    const userCollectionExists = collections.some((col) => col.id === "user");
    if (!userCollectionExists) {
      console.warn("⚠ The 'user' collection does not exist yet!");
    }

    // List some documents in 'user'
    const userSnapshot = await db.collection("user").limit(5).get();
    console.log(
      `Number of documents in 'user' collection: ${userSnapshot.size}`
    );
    userSnapshot.forEach((doc) =>
      console.log(` - doc id: ${doc.id}, data:`, doc.data())
    );

    // Attempt to get a specific test document
    const testDocId = "8TRGzR7sIGd15z8xq6xu"; // your doc ID
    const docRef = db.collection("user").doc(testDocId);

    try {
      const doc = await docRef.get();
      if (!doc.exists) {
        console.warn(
          `⚠ Test document '${testDocId}' does not exist (expected if you haven't created it yet).`
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
    console.error("An error occurred during the Firebase test:");
    console.error(error);
  }
}

testFirebase();
