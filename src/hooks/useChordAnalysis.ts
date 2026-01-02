import { fretToNote } from "@/lib/instrument/fretToNote";
import { Guitar } from "@/lib/instrument/guitar";
import { resolveChord } from "@/lib/music/inference/resolveChord";
import { convertToCanonicalArray } from "@/lib/music/observation/canonical";
import { ObservedNote } from "@/types/ui/observed-note";
import { useCallback, useState } from "react";

export function useChordAnalysis(
  fretAndStringsArray: [number, number][],
  mutedStrings: number[]
) {
  const [bestChordMatches, setBestChordMatches] = useState<ChordMatches[]>([]);

  const analyze = useCallback(() => {
    const canonicalArray = convertToCanonicalArray(
      fretAndStringsArray,
      mutedStrings
    );
    const observedNotes: ObservedNote[] = canonicalArray
      .map((fret, string) => {
        const noteFromFret = fretToNote(fret, string, Guitar.tunings.standard);
        if (!noteFromFret) return null;
        return {
          stringIndex: string,
          fret: fret,
          note: noteFromFret,
        };
      })
      .filter((object): object is ObservedNote => object != null);
    const bestMatches = resolveChord(observedNotes).map((match) => {
      return {
        root: match.root,
        chordType: match.chordType,
        score: match.score,
      };
    });
    console.log(bestMatches);

    setBestChordMatches(bestMatches);
  }, [fretAndStringsArray, mutedStrings]);

  return { analyze, bestChordMatches };
}
