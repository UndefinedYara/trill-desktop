export function getCleanObject(fileContent: string): OriginalChord {
  let objectString = fileContent
    .replace(/export\s+default\s+/, "")
    .trim()
    .replace(/;\s*$/, "");

  if (!objectString.startsWith("{") || !objectString.endsWith("}")) {
    throw new Error("Invalid default export format");
  }

  const jsonLike = objectString
    // quote keys
    .replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":')
    // single → double quotes
    .replace(/'/g, '"')
    // remove trailing commas
    .replace(/,\s*([\]}])/g, "$1");

  const parsed = JSON.parse(jsonLike);

  return {
    key: parsed.key,
    suffix: parsed.suffix,
    positions: parsed.positions,
  };
}
