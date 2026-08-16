import path from "path";
import fs from "fs";
import { chordsCollection } from "../../src/lib/firebase/firebase-server-config";

async function main() {
  const args = process.argv.slice(2);
  const pathArg = args.find((arg) => arg.startsWith("--path="));
  if (!pathArg) {
    throw new Error("Missing --path argument");
  }
  const rawPath = pathArg.replace("--path=", "");

  // This normalizes Windows / Unix paths safely
  const basePath = path.resolve(rawPath);
  console.log("Using file path:", basePath);

  const fileContent = fs.readFileSync(basePath, "utf-8");
  const data = JSON.parse(fileContent);

  const WRITE_RUN = args.includes("--write");
  const entries = Object.values(data);
  console.log(`Total descriptions found: ${entries.length}`);

  if (WRITE_RUN) {
    console.log(`Updating chords with descriptions...`);
    let updatedCount = 0;
    
    for (const entry of entries as any[]) {
      if (!entry.success || !entry.description) continue;
      
      const searchKey = entry.key.toLowerCase();
      const searchSuffix = entry.suffix.toLowerCase();

      try {
        const snapshot = await chordsCollection
          .where("key", "==", searchKey)
          .where("suffix", "==", searchSuffix)
          .get();

        if (snapshot.empty) {
          console.log(`No chord found for ${searchKey}${searchSuffix}`);
          continue;
        }

        for (const doc of snapshot.docs) {
          await doc.ref.update({ description: entry.description });
          updatedCount++;
        }
        
        console.log(`Updated chord: ${searchKey}${searchSuffix}`);
      } catch (e) {
        console.error(`Error updating ${searchKey}${searchSuffix}:`, e);
      }
    }
    
    console.log(`Updated ${updatedCount} chord documents!`);
  } else {
    console.log("DRY RUN - no data will be written to Firestore");
    const firstEntry = entries[0] as any;
    console.log("Would update chord:", firstEntry.key.toLowerCase() + firstEntry.suffix.toLowerCase(), "with description:", firstEntry.description);
  }
}

main().then(() => {
  console.log("DONE updating Firestore!");
  process.exit(0);
}).catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
