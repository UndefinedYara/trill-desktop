import * as fs from "fs";
import * as path from "path";
import { transformChord } from "./transform-chords";
import { getCleanObject } from "./clean-object";

export function readAndNormalize() {
  const basePath = path.resolve(
    process.cwd(),
    "../chords-db/src/db/guitar/chords"
  );
  const directories = fs.readdirSync(basePath);
  const results: any[] = [];

  for (const directory of directories) {
    if (directory === "desktop.ini" || directory === "index.js") continue;

    const files = fs.readdirSync(path.join(basePath, directory));

    for (const file of files) {
      if (file === "index.js") continue;

      const content = fs.readFileSync(
        path.join(basePath, directory, file),
        {
          encoding: "utf8",
        }
      );

      const cleaned = getCleanObject(content);
      const transformed = transformChord(cleaned);

      results.push(transformed);
    }
  }

  return results;
}
