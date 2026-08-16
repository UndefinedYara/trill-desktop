import { fretToNote } from "@/lib/instrument/fret-to-note";
import { Guitar } from "@/lib/instrument/guitar";
import { resolveChord } from "@/lib/music/inference/resolve-chord";
import { convertToCanonicalArray } from "@/lib/music/observation/canonical";
import { CalculateVoicing } from "@/lib/music/voicing-analysis/calculate-voicing";
import { ObservedNote } from "@/types/ui/observed-note";
import { useCallback, useState } from "react";

export function useChordAnalysis(
  fretAndStringsArray: [number, number][],
  mutedStrings: number[],
) {
  const [bestChordMatches, setBestChordMatches] = useState<ChordMatches[]>([]);

  const analyze = useCallback(() => {
    const canonicalArray = convertToCanonicalArray(
      fretAndStringsArray,
      mutedStrings,
    );

    const observedNotes: ObservedNote[] = canonicalArray
      .map((fret, string) => {
        const noteFromFret = fretToNote(fret, string, Guitar.tunings.standard);
        if (!noteFromFret) return null;
        return {
          stringIndex: string,
          fret,
          note: noteFromFret,
        };
      })
      .filter((object): object is ObservedNote => object != null);


    const bestMatches = resolveChord(observedNotes).map((match) => {
      return {
        root: match.root,
        chordType: match.chordType,
        score: match.score,
        formula: match.formula,
      }
    });

    // 2️⃣ Add voicing info
    const bestMatchesWithVoicing = CalculateVoicing(observedNotes, bestMatches);

    const finalMatches: ChordMatches[] = [];
    const finalMatchesSet = new Set<string>(); // string keys for uniqueness

    for (const match of bestMatchesWithVoicing) {
      let root = match.root;
      let chordType = match.chordType;

      // Handle bass notation for DB
      if (root.includes("/")) {
        const [r, bass] = root.split("/");
        root = r;
        chordType = "/" + bass; // DB expects chordType = bass
      }

      const key = `${root}${chordType}`; // unique key for this DB entry
      if (!finalMatchesSet.has(key)) {
        finalMatchesSet.add(key);
        finalMatches.push({
          ...match,
          root,
          chordType,
        });
      }
    }

    setBestChordMatches(finalMatches);
  }, [fretAndStringsArray, mutedStrings]);

  return { analyze, bestChordMatches };
}
