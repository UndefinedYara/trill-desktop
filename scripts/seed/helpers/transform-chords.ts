export function transformChord(chord: any) {
  const positions = chord.positions;

  for (const pos of positions) {
    pos.frets = pos.frets.split("").map((f: string) => {
      if (f === "x") return -1; // muted string
      if (/[0-9]/.test(f)) return parseInt(f); // frets 0-9
      return f.charCodeAt(0) - 87; // some frets use 'a', 'b', 'c' for 10, 11, 12 etc, this avoids NaN
    });

    pos.fingers = pos.fingers.split("").map((f: string) => parseInt(f));

    if (pos.barres == null) pos.barres = [];
    else if (!Array.isArray(pos.barres)) pos.barres = [pos.barres];
    pos.capo = pos.capo === "true" ? true : !!pos.capo;
  }

  return chord;
}
