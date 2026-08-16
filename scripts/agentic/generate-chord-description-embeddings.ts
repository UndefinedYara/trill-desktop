import { chordsCollection } from "../../src/lib/firebase/firebase-server-config";
import { createVectorMap } from "../../src/lib/agent/utils/create-vector-map";
import { FieldValue } from "firebase-admin/firestore";

async function main() {
  const args = process.argv.slice(2);
  const WRITE_RUN = args.includes("--write");
  const FORCE_RUN = args.includes("--force");

  console.log("Fetching chords from Firestore...");
  const snapshot = await chordsCollection.get();
  const chords = snapshot.docs;
  console.log(`Total chords found: ${chords.length}`);

  let updatedCount = 0;
  let skippedCount = 0;
  let noDescriptionCount = 0;
  let noDescriptionChords = []

  for (const doc of chords) {
    const data = doc.data();

    if (!data.description) {
      noDescriptionCount++;
      noDescriptionChords.push({
        key: data.key,
        suffix: data.suffix
      });
      continue;
    }

    if (data.vector && !FORCE_RUN) {
      skippedCount++;
      continue;
    }

    try {
      console.log(`Generating embedding for ${data.key}${data.suffix}...`);
      // We pass the description string to generate its semantic embedding.
      const embedding = await createVectorMap(data.description);

      // Store as standard number[] which plays nicely with Firestore & JS indexing
      const vectorArray = Array.from(embedding);

      if (WRITE_RUN) {
        await doc.ref.update({
          vector: FieldValue.vector(vectorArray),
        });
        console.log(`Updated vector for ${data.key}${data.suffix}`);
        updatedCount++;
      } else {
        console.log(`DRY RUN: Generated embedding of length ${vectorArray.length} for ${data.key}${data.suffix}`);
        updatedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${data.key}${data.suffix}:`, error);
    }
  }

  console.log("--- Summary ---");
  console.log(`Total chords: ${chords.length}`);
  console.log(`No description: ${noDescriptionCount}`);
  console.log(`Skipped (already has vector): ${skippedCount} (use --force to overwrite)`);
  console.log(`Processed: ${updatedCount}`);

  if (!WRITE_RUN) {
    console.log("DRY RUN - no data was written to Firestore. Run with --write to save vectors.");
  }
}

main().then(() => {
  console.log("DONE!");
  process.exit(0);
}).catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
