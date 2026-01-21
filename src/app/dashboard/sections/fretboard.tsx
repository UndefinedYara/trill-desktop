"use client";
import { Fret } from "@/components/ui/fret";
import { useState } from "react";
import { X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useFindChordsByBestMatches } from "@/queries/chord/use-find-chords-by-best-matches";
import { ChordPalette } from "@/components/ui/chordpalette";
import {
  INITIAL_FRET_WIDTH,
  FRET_WIDTH_DECREMENT,
  FRET_COUNT,
  STRING_COUNT,
  FRET_MARKERS,
  MUTED_STRING_COLOR,
} from "@/components/ui/consts";
import { useChordAnalysis } from "@/hooks/use-chord-analysis";
import { ChordType } from "@/types/ui/chord";

const getFretWidth = (index: number) => {
  return Math.max(INITIAL_FRET_WIDTH - index * FRET_WIDTH_DECREMENT, 0);
};

export function Fretboard() {
  const [fretAndStringsArray, setFretAndStringsArray] = useState<
    [number, number][]
  >([]);
  const [mutedStrings, setMutedStrings] = useState<number[]>([]);

  const { bestChordMatches, analyze } = useChordAnalysis(
    fretAndStringsArray,
    mutedStrings,
  );

  const chordMatchCollection = useFindChordsByBestMatches(bestChordMatches);

  const topScoreChord =
    bestChordMatches.length > 0
      ? bestChordMatches.reduce(
          (acc, current) => (acc.score > current.score ? acc : current),
          bestChordMatches[0],
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

  function onClear() {
    setFretAndStringsArray([]);
    setMutedStrings([]);
  }

  function onFind() {
    analyze();
  }

  return (
    <section
      id="fretboard"
      className="hidden md:flex flex-col w-full mt-12  justify-center gap-10 "
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className=" text-2xl md:text-4xl font-bold">Fretboard</h2>
          <p>
            Noodling around? Find more about the chord you just played. Enter
            notes down below.
          </p>
        </div>
        <div className="hidden md:flex  justify-end pt-10">
          <Button
            className="hover:cursor-pointer bg-transparent"
            onClick={onClear}
          >
            Clear Strings
          </Button>
        </div>
      </div>
      {/* Fretboard */}
      <div className="hidden md:flex flex-col">
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
        <div className="flex justify-end pt-10">
          <Button
            className="hover:cursor-pointer"
            loading={chordMatchCollection.isLoading}
            onClick={onFind}
          >
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
      <div className="flex gap-10 justify-center">
        {chordMatchCollection.data &&
          topScoreChord &&
          chordMatchCollection.data.map((chord: ChordType) => {
            const chordScore = bestChordMatches.find(
              (bestMatchChord) =>
                chord.key === bestMatchChord.root &&
                chord.suffix === bestMatchChord.chordType,
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
