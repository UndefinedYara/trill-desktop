import { execSync } from "child_process";
import { rmSync, existsSync } from "fs";
import path from "path";

const TEMP_DIR = path.join(process.cwd(), "temp-scripts");
const args = process.argv.slice(2).join(" ");

execSync(`npx tsc -p scripts/tsconfig.seed.json`, {
  stdio: "inherit",
});

const seedPath = path.join(TEMP_DIR, "/scripts/seed/seed.js");
execSync(`node "${seedPath}" ${args}`, { stdio: "inherit" });

if (existsSync(TEMP_DIR)) {
  rmSync(TEMP_DIR, { recursive: true, force: true });
  console.log("✅ Temporary folder removed:", TEMP_DIR);
}
