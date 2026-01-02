"use client";

import { useState } from "react";
import { Guitar } from "@/lib/instrument/guitar";
import Chord from "@/components/ui/chord-graph/chord";
import { useFindChordsByKeyAndSuffix } from "@/queries/chord/useFindChordsByKeyAndSuffixes";
import { Skeleton } from "@/components/ui/skeleton";
import { ChordType } from "@/types/ui/chord";

interface ChordLibraryProps {
  keys: string[];
  suffixes: string[];
}

export function ChordLibrary({ keys, suffixes }: ChordLibraryProps) {
  const [activeKey, setActiveKey] = useState<string>("A");
  const [activeSuffix, setActiveSuffix] = useState<string>("major");

  const chordCollection = useFindChordsByKeyAndSuffix(activeKey, activeSuffix);
  return (
    <section
      id="library"
      className="indent w-full my-12 pb-5 flex flex-col gap-10 "
    >
      <div>
        <h2 className="text-4xl font-bold">Library</h2>
        <p>Discover more chords, positions, keys, and more. </p>
      </div>
      {/* Key Selection */}
      <div className="grid grid-cols-10 gap-7 ">
        <div className="flex justify-between  gap-3 w-full col-span-10">
          {keys.map((key) => (
            <div
              key={key}
              onClick={() => setActiveKey(key)}
              style={{
                backgroundColor: key === activeKey ? "#7f1d1d" : "",
                color: key === activeKey ? "white" : "",
              }}
              className="w-full text-center py-1 rounded-md hover:cursor-pointer hover:bg-[#7f1d1d]"
            >
              {key}
            </div>
          ))}
        </div>
        <div className="flex flex-col  gap-3 cols-span-1  max-h-screen overflow-y-scroll overflow-x-hidden p-2 left-scrollbar">
          {suffixes.map((suffix) => (
            <div
              key={suffix}
              onClick={() => setActiveSuffix(suffix)}
              style={{
                backgroundColor: suffix === activeSuffix ? "#7f1d1d" : "",
                color: suffix === activeSuffix ? "white" : "",
              }}
              className="w-full text-center py-1 rounded-md hover:cursor-pointer hover:bg-[#7f1d1d]"
            >
              {suffix}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5 col-span-9 mt-5">
          {chordCollection.isLoading && (
            <div className="flex justify-between gap-5">
              <Skeleton className="h-50 w-50" />
              <Skeleton className="h-50 w-50" />
              <Skeleton className="h-50 w-50" />
              <Skeleton className="h-50 w-50" />
              <Skeleton className="h-50 w-50" />
            </div>
          )}
          {chordCollection.isError && (
            <div className="flex items-center justify-center h-40">
              <p>No chords found.</p>
            </div>
          )}
          {chordCollection.data &&
            chordCollection.data.map((chord: ChordType) => {
              return (
                <div key={chord.id} className="">
                  <div className="grid grid-cols-4">
                    {chord.positions &&
                      chord.positions.map((position: ChordType, index) => (
                        <Chord
                          key={chord.key + chord.id + index}
                          chord={position}
                          instrument={Guitar}
                        />
                      ))}
                  </div>
                </div>
              );
            })}
          {chordCollection.data &&
            chordCollection.data.length === 0 &&
            !chordCollection.isLoading && (
              <p className="text-center py-7">
                No chords found. Try a different key/suffix combo.
              </p>
            )}
        </div>
      </div>
    </section>
  );
}
