// this function converts an array of [fret, string] pairs into a canonical array
// representation where the index represents the string number (0-based) and the value at that index represents the fret number
// and then it is reversed so that strings are in standard order (6th string to 1st string)
// tuning are also low to high
export function convertToCanonicalArray(
  fretAndStringsArray: [number, number][],
  mutedStrings: number[]
): number[] {
  const canonical = Array(6).fill(0);
  fretAndStringsArray.forEach(([stringNumber, fret]) => {
    canonical[stringNumber - 1] = fret;
  });
  mutedStrings.forEach((stringNumber) => {
    canonical[stringNumber - 1] = -1;
  });

  return canonical.reverse();
}
