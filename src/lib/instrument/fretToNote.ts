import { ChromaticScale } from "../music";

export function fretToNote(
  fret: number,
  stringIndex: number,
  tuning: string[]
) {
  if (fret < 0) return null;
  const openStringNote = tuning[stringIndex];
  const openIndex = ChromaticScale.indexOf(openStringNote);
  const noteIndex = (openIndex + fret) % 12;
  const note = ChromaticScale[noteIndex];

  return note;
}
