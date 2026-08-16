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
} from "@/consts";
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
  const [hasSearched, setHasSearched] = useState(false);

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
    setHasSearched(false);
  }

  function onFind() {
    analyze();
    setHasSearched(true);
  }

  return (
    <section
      id="fretboard"
      className="hidden md:flex flex-col w-full mt-12  justify-center gap-10 "
    >
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tighter drop-shadow-lg">
            Interactive <span className="text-red-500">Fretboard</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-medium max-w-2xl">
            Noodling around? Find out what chord you just played by entering notes down below.
          </p>
        </div>

      </div>
      {/* Fretboard */}
      <div className="hidden md:flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-5 mt-4 transition-all">
        <div className="absolute -inset-5 bg-gradient-to-r from-red-600 to-gray-500  blur-sm opacity-10 "></div>
        <div className="hidden md:flex justify-end mb-2 z-10 px-2 py-2">
          <Button
            className="hover:cursor-pointer bg-transparent hover:bg-white/20 rounded-full px-5 py-2 text-sm font-medium transition-all"
            onClick={onClear}
          >
            Clear Strings
          </Button>
        </div>
        <div className="flex items-center justify-center ml-3">
          <div className="flex flex-row-reverse rounded-xl w-full border border-white/20 bg-black/20 shadow-inner overflow-hidden ring-1 ring-white/5">
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
          <div className="flex flex-col-reverse z-10">
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
        <div className="flex justify-end pt-10 z-10">
          <Button
            className="hover:cursor-pointer bg-primary hover:bg-primary/90 text-white rounded-full px-7 py-5 text-md font-medium transition-all shadow-lg hover:scale-105"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
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

        {hasSearched && !chordMatchCollection.isLoading &&
          bestChordMatches.length === 0 && (
            <div className="flex w-full col-span-2">
              <p className="text-white/50">No chord matches found for this combination, try to adjust the notes.</p>
            </div>
          )}

        {hasSearched && chordMatchCollection.isFetched && !chordMatchCollection.isLoading &&
          chordMatchCollection.data?.length === 0 && bestChordMatches.length > 0 && (
            <div className="flex w-full col-span-2">
              <p className="text-white/50">No chord matches found for this combination, try to adjust the notes.</p>
            </div>
          )}
      </div>
    </section>
  );
}
