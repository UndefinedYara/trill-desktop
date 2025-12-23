"use client";
import { Fret } from "@/components/ui/fret";
import { useRef, useState } from "react";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ChordType } from "ChordModule";
import { Guitar } from "@/lib/instrument/guitar";
import { Button } from "@/components/ui/button";
import { convertToCanonicalArray } from "@/lib/music/observation/canonical";
import { fretToNote } from "@/lib/instrument/fretToNote";
import { ObservedNote } from "@/types/observed-note";
import { resolveChord } from "@/lib/music/inference/resolveChord";
import { useFindChordsByBestMatches } from "@/queries/chord/useFindChordsByBestMatches";
import { ChordPalette } from "@/components/ui/chordpalette";
import {
  INITIAL_FRET_WIDTH,
  FRET_WIDTH_DECREMENT,
  FRET_COUNT,
  STRING_COUNT,
  FRET_MARKERS,
  MUTED_STRING_COLOR,
} from "@/components/ui/consts";

const getFretWidth = (index: number) => {
  return Math.max(INITIAL_FRET_WIDTH - index * FRET_WIDTH_DECREMENT, 0);
};

export function Fretboard() {
  const [fretAndStringsArray, setFretAndStringsArray] = useState<
    [number, number][]
  >([]);

  const [mutedStrings, setMutedStrings] = useState<number[]>([]);
  const [bestChordMatches, setBestChordMatches] = useState<
    { root: string; chordType: string; score: number }[]
  >([]);
  const chordMatchCollection = useFindChordsByBestMatches(bestChordMatches);

  const topScoreChord =
    bestChordMatches.length > 0
      ? bestChordMatches.reduce(
          (acc, current) => (acc.score > current.score ? acc : current),
          bestChordMatches[0]
        )
      : null;

  function muteHandler(stringNumber: number) {
    let array = [...mutedStrings];
    if (array.includes(stringNumber)) {
      array = array.filter((string) => string !== stringNumber);
    } else {
      array.push(stringNumber);
    }
    setMutedStrings(array);
  }

  function onFind() {
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
    setBestChordMatches(bestMatches);
  }

  return (
    <section className="indent w-full mt-12 flex flex-col justify-center gap-10 ">
      <div>
        <h2 className="text-4xl font-semibold">Fretboard</h2>
        <p>Find a chord&apos;s name by its notes </p>
      </div>
      {/* Fretboard */}
      <div className="flex flex-col">
        <div className="flex items-center justify-center ml-3">
          <div className="flex flex-row-reverse rounded-md w-full border border-gray-500">
            {new Array(FRET_COUNT).fill(0).map((_, index) => {
              const width = getFretWidth(index);
              return (
                <Fret
                  key={index}
                  fretNumber={index + 1}
                  style={{ width: `${width}px` }}
                  marker={FRET_MARKERS.includes(index + 1)}
                  doubleMarker={index + 1 === 12}
                  mutedStrings={mutedStrings}
                  fretAndStringsArray={fretAndStringsArray}
                  setFretAndStringsArray={setFretAndStringsArray}
                />
              );
            })}
          </div>
          <div className="flex flex-col-reverse">
            {new Array(STRING_COUNT).fill(0).map((_, index) => {
              const stringNumber = index + 1;
              return (
                <X
                  key={stringNumber}
                  onClick={() => {
                    muteHandler(stringNumber);
                  }}
                  className="hover:cursor-pointer"
                  style={{
                    stroke: mutedStrings.includes(stringNumber)
                      ? MUTED_STRING_COLOR
                      : "white",
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex justify-end py-5">
          <Button loading={chordMatchCollection.isLoading} onClick={onFind}>
            Find Chord
          </Button>
        </div>
      </div>

      {chordMatchCollection.isLoading && (
        <div className="flex gap-5 h-48">
          <Skeleton className="w-[270px] h-full"></Skeleton>
          <Skeleton className="w-[270px] h-full"></Skeleton>
          <Skeleton className="w-[270px] h-full"></Skeleton>
          <Skeleton className="w-[270px] h-full"></Skeleton>
          <Skeleton className="w-[270px] h-full"></Skeleton>
        </div>
      )}
      <div className="flex gap-10">
        {chordMatchCollection.data &&
          topScoreChord &&
          chordMatchCollection.data.map((chord: ChordType) => {
            const chordScore = bestChordMatches.find(
              (bestMatchChord) =>
                chord.key === bestMatchChord.root &&
                chord.suffix === bestMatchChord.chordType
            )?.score;

            if (chordScore === undefined) {
              return null;
            }
            let chordType = {
              ...chord,
              score: chordScore,
              topScore: topScoreChord.score,
            };
            return (
              <ChordPalette chord={chordType} key={chord.id}></ChordPalette>
            );
          })}
      </div>
    </section>
  );
}
