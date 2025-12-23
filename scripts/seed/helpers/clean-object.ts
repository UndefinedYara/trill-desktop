export function getCleanObject(dirtyObject: any) {
  let clean = dirtyObject.replace(/'/g, '"');
  clean = clean.replace("export default", "");
  clean = clean.replace("import", "");
  clean = clean.replace(";", "");
  clean = clean.replace(/,\s*([\]}])/g, "$1");
  return eval(`(${clean})`);
}
