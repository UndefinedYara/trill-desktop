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
  console.log("Using base path:", basePath);
  const chords = readAndNormalize(basePath);
  const chordKeys = Array.from(
    new Set(chords.map((chord) => chord.key.toLowerCase())),
  );
  const chordSuffixes = Array.from(
    new Set(chords.map((chord) => chord.suffix.toLowerCase())),
  );
  const WRITE_RUN = args.includes("--write");
  console.log(`Total chords found: ${chords.length}`);

  if (WRITE_RUN) {
    console.log(`Seeding chord keys...`);
    console.log(`Seeding chord suffixes...`);
    const keysDocRef = keysCollection.doc("keys");
    const suffixesDocRef = suffixesCollection.doc("suffixes");
    await keysDocRef.set({ values: chordKeys });
    await suffixesDocRef.set({ values: chordSuffixes });
    console.log(`Seeding chords`);
    for (const chord of chords) {
      try {
        await chordsCollection.add(chord);
      } catch (e) {
        console.log(e);
      }
      console.log("Added chord:", chord.key + chord.suffix);
    }
  } else {
    console.log("DRY RUN - no data will be written to Firestore");
    console.log("Added chord:", chords[0].key + chords[0].suffix);
    console.log("Added chord shape:", chords[0]);
    console.log("Found chord keys:", chordKeys);
    console.log("Found chord types:", chordSuffixes);
  }
}
console.log("DONE seeding Firestore!");

main();
