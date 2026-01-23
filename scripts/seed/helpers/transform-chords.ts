import { ASCII_OFFSET_FOR_LETTER_FRETS } from "../../consts";

const normalizeFrets = (frets: string): number[] =>
  frets.split("").map((f) => {
    if (f === "x") return -1;
    if (/[0-9]/.test(f)) return Number(f);
    return f.charCodeAt(0) - ASCII_OFFSET_FOR_LETTER_FRETS; // a → 10, b → 11
  });

const normalizeFingers = (fingers: string): number[] =>
  fingers.split("").map(Number);

const normalizeBarres = (barres?: number | number[]): number[] => {
  if (barres == null) return [];
  return Array.isArray(barres) ? barres : [barres];
};

export function transformChord(chord: OriginalChord): TransformedChord {
  return {
    key: chord.key.toLowerCase(),
    suffix: chord.suffix.toLowerCase(),
    positions: chord.positions.map((pos) => ({
      frets: normalizeFrets(pos.frets),
      fingers: normalizeFingers(pos.fingers),
      barres: normalizeBarres(pos.barres),
      capo: Boolean(pos.capo),
    })),
  };
}
