import { ObservedNote } from "@/types/ui/observed-note";
import { identifyChord } from "../matching/identify-chord";
import { collapseByPitchClass } from "./collapse-by-pitch-class";

export function resolveChord(notes: ObservedNote[]) {
  let chordMatches = [];

  const uniqueNotes = collapseByPitchClass(notes);
  const matchedChords = identifyChord(uniqueNotes);

  chordMatches = matchedChords;

  if (chordMatches.length > 0) {

    const sortedChords = chordMatches.sort(
      (chordA, chordB) => chordB.score - chordA.score,
    );
    const topMatches = sortedChords.slice(0, 3);
    const topScore = topMatches[0].score;
    const matchesWithConfidence = topMatches.map((chord) => ({
      ...chord,
      confidence: (chord.score / topScore) * 100,
    }));
    return matchesWithConfidence;
  } else {
    return [];
  }
}
