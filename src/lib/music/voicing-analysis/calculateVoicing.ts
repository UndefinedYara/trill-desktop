import { ObservedNote } from "@/types/ui/observed-note";
import { calculateBassNote } from "./calculateBassNote";
import { IntervalBetweenNotes } from "../theory/intervals";

export function CalculateVoicing(
  observedNotes: ObservedNote[],
  chordMatches: ChordMatches[]
): ChordMatches[] {
  const matchedChordsArray = [];

  for (const chord of chordMatches) {
    const bassNote = calculateBassNote(observedNotes);
    if (bassNote === chord.root) {
      matchedChordsArray.push(chord);
    } else if (bassNote) {
      const bassNoteInterval = IntervalBetweenNotes(chord.root, bassNote);
      if (chord.formula.includes(bassNoteInterval)) {
        matchedChordsArray.push({
          ...chord,
          root: chord.root + "/" + bassNote,
          voicing: "Inversion",
        });
      } else {
        matchedChordsArray.push({
          ...chord,
          root: chord.root + "/" + bassNote,
          voicing: "Slash Chord",
        });
      }
    }
  }
  return matchedChordsArray;
}
