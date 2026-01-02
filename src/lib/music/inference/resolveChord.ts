import { ObservedNote } from "@/types/ui/observed-note";
import { identifyChord } from "../matching/identifyChord";
import { collapseByPitchClass } from "./collapseByPitchClass";

export function resolveChord(notes: ObservedNote[]) {
  let chordMatches = [];

  const uniqueNotes = collapseByPitchClass(notes);
  console.log(uniqueNotes);
  const matchedChords = identifyChord(uniqueNotes);
  chordMatches = matchedChords;

  const sortedChords = chordMatches.sort(
    (chordA, chordB) => chordB.score - chordA.score
  );
  const topMatches = sortedChords.slice(0, 3);
  const topScore = topMatches[0].score;
  const matchesWithConfidence = topMatches.map((chord) => ({
    ...chord,
    confidence: (chord.score / topScore) * 100,
  }));
  return matchesWithConfidence;
}
