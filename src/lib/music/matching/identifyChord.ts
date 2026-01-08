import { ObservedNote } from "@/types/ui/observed-note";
import { CHORD_FORMULAS, IntervalBetweenNotes } from "../theory/intervals";
import { scoreChord } from "./scoreChord";
import { toEnharmonicNote } from "../theory/toEnharmonicNote";

export function identifyChord(noteObjects: ObservedNote[]) {
  const notes = noteObjects.map((item) => item.note);
  const bestMatches: {
    root: string;
    chordType: string;
    score: number;
    formula: number[];
  }[] = [];

  for (let i = 0; i < notes.length; i++) {
    const root = notes[i];
    if (root === null) continue;

    const validNotes = notes.filter((note) => note !== null);
    const playedChordInterval = validNotes
      .map((note) => IntervalBetweenNotes(root, note))
      .sort((a, b) => a - b);
    for (const [chordType, formula] of Object.entries(CHORD_FORMULAS)) {
      const score = scoreChord(playedChordInterval, formula);
      if (score > 5) {
        bestMatches.push({ root, chordType, score, formula });
      }
    }
  }
  const enharmonicNormalizedRoots = bestMatches.map((chordMatch) => {
    return {
      ...chordMatch,
      root: toEnharmonicNote(chordMatch.root),
    };
  });
  console.log(enharmonicNormalizedRoots);
  return enharmonicNormalizedRoots;
}
