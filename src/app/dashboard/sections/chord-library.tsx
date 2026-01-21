"use client";

import { useState } from "react";
import { useFindChordsByKeyAndSuffix } from "@/queries/chord/use-find-chords-by-key-and-suffixes";
import { Skeleton } from "@/components/ui/skeleton";
import { ChordType } from "@/types/ui/chord";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { MemoChordPalette } from "@/components/ui/memo-chord-palette";

interface ChordLibraryProps {
  keys: string[];
  suffixes: string[];
}

export function ChordLibrary({ keys, suffixes }: ChordLibraryProps) {
  const [chordQuery, setChordQuery] = useState<string>("");

  const chordCollection = useFindChordsByKeyAndSuffix("A", "major");
  function handleSearch() {}
  return (
    <section id="library" className="w-full my-12 pb-5 flex flex-col gap-10">
      <div>
        <h2 className="text-4xl font-bold">Library</h2>
        <p>Discover more chords, positions, keys, and more.</p>
      </div>

      <div className="flex w-3/4">
        <Input
          fieldName={"Search"}
          placeholder={"What chord are you looking for?"}
          type={"text"}
          value={chordQuery}
          onChange={(e) => setChordQuery(e.target.value)}
        />
        <Button
          type="button"
          className="bg-transparent px-0"
          onClick={handleSearch}
        >
          <Search />
        </Button>
      </div>
      <div className="md:gap-5 col-span-10 md:col-span-9 mt-5">
        {chordCollection.isLoading && (
          <div className="flex justify-between gap-5">
            <Skeleton className="h-50 w-50" />
            <Skeleton className="h-50 w-50" />
            <Skeleton className="h-50 w-50 hidden md:block" />
            <Skeleton className="h-50 w-50 hidden md:block" />
            <Skeleton className="h-50 w-50 hidden md:block" />
          </div>
        )}

        {chordCollection.isError && (
          <div className="flex items-center justify-center h-40">
            <p>No chords found.</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5">
          {chordCollection.data &&
            chordCollection.data.map((chord: ChordType) => (
              <div key={chord.key + chord.id}>
                <MemoChordPalette chord={chord} />
              </div>
            ))}
        </div>

        {chordCollection.data &&
          chordCollection.data.length === 0 &&
          !chordCollection.isLoading && (
            <p className="text-center py-7">
              No chords found. Try a different key/suffix combo.
            </p>
          )}
      </div>
    </section>
  );
}
