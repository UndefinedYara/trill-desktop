import path from "path";
import {
  chordsCollection,
  keysCollection,
  suffixesCollection,
} from "../../src/lib/firebase/firebase-server-config";
import { readAndNormalize } from "./helpers/read-and-normalize";

async function main() {
  const args = process.argv.slice(2);
  const pathArg = args.find((arg) => arg.startsWith("--path="));
  if (!pathArg) {
    throw new Error("Missing --path argument");
  }
  const rawPath = pathArg.replace("--path=", "");

  // This normalizes Windows / Unix paths safely
  const basePath = path.resolve(rawPath);
  console.log("Using base path for local chords:", basePath);
  
  // 1. Load local chords
  const localChords = readAndNormalize(basePath);
  console.log(`Total local chords found: ${localChords.length}`);

  // 2. Load existing chords from Firestore
  console.log("Fetching existing chords from Firestore...");
  const snapshot = await chordsCollection.get();
  const existingSet = new Set(
    snapshot.docs.map((doc) => {
      const data = doc.data();
      return `${data.key.toLowerCase()}-${data.suffix.toLowerCase()}`;
    })
  );
  console.log(`Total existing chords in DB: ${existingSet.size}`);

  // 3. Find missing chords
  const missingChords = localChords.filter((chord) => {
    const identifier = `${chord.key.toLowerCase()}-${chord.suffix.toLowerCase()}`;
    return !existingSet.has(identifier);
  });

  console.log(`Found ${missingChords.length} missing chords to insert!`);

  const WRITE_RUN = args.includes("--write");

  if (WRITE_RUN) {
    if (missingChords.length === 0) {
      console.log("No missing chords to insert.");
      return;
    }

    console.log(`Inserting ${missingChords.length} missing chords...`);
    let addedCount = 0;
    for (const chord of missingChords) {
      try {
        await chordsCollection.add(chord);
        console.log("Added missing chord:", chord.key + chord.suffix);
        addedCount++;
      } catch (e) {
        console.error(`Failed to add ${chord.key}${chord.suffix}:`, e);
      }
    }
    console.log(`Successfully added ${addedCount} missing chords!`);

    // 4. Update keys and suffixes just in case the missing ones introduced new ones
    console.log("Updating keys and suffixes collections...");
    const allChords = [...localChords]; // The full set
    const chordKeys = Array.from(new Set(allChords.map((c) => c.key.toLowerCase())));
    const chordSuffixes = Array.from(new Set(allChords.map((c) => c.suffix.toLowerCase())));

    const keysDocRef = keysCollection.doc("keys");
    const suffixesDocRef = suffixesCollection.doc("suffixes");
    await keysDocRef.set({ values: chordKeys });
    await suffixesDocRef.set({ values: chordSuffixes });
    console.log("Keys and suffixes updated.");
  } else {
    console.log("DRY RUN - no data will be written to Firestore");
    if (missingChords.length > 0) {
      console.log("First few missing chords:", missingChords.slice(0, 5).map(c => c.key + c.suffix));
    }
  }
}

main().then(() => {
  console.log("DONE!");
  process.exit(0);
}).catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
