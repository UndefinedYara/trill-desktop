"use client";

import { useEffect, useState } from "react";
import { useFindChordsByKeyAndSuffix } from "@/queries/chord/use-find-chords-by-key-and-suffixes";
import { Skeleton } from "@/components/ui/skeleton";
import { ChordType } from "@/types/ui/chord";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { MemoChordPalette } from "@/components/ui/memo-chord-palette";
import { useChordSearch } from "@/hooks/use-chord-search";

interface ChordLibraryProps {
  keys: string[];
  suffixes: string[];
}

export function ChordLibrary({ keys, suffixes }: ChordLibraryProps) {
  const [chordQuery, setChordQuery] = useState<string>("");
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [chords, setChords] = useState<ChordType[]>([]);
  const { activeSuffix, activeKey, analyze } = useChordSearch(keys, suffixes);

  const chordCollection = useFindChordsByKeyAndSuffix(
    activeKey,
    activeSuffix,
    cursor,
  );

  useEffect(() => {
    if (chordCollection.data) {
      setChords((prev) =>
        cursor
          ? [...prev, ...chordCollection.data.data]
          : [...chordCollection.data.data],
      );
    }
  }, [chordCollection.data, cursor]);
  function handleSearch() {
    setCursor(undefined);
    setChords([]);
    analyze(chordQuery);
  }
  return (
    <section id="library" className="w-full my-12 pb-5 flex flex-col gap-10 ">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-primary">
          Chord Library
        </h2>
        <p className="">Discover more chords, positions, keys, and more.</p>
      </div>

      <div className="flex w-full md:w-2/5">
        <Input
          fieldName={"Search"}
          placeholder={"What chord are you looking for?"}
          type={"text"}
          value={chordQuery}
          onChange={(e) => setChordQuery(e.target.value)}
        />
        <Button
          type="button"
          className="bg-primary/80 px-2"
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-12">
          {chords.map((chord: ChordType, index) => (
            <div key={chord.key + chord.suffix + index}>
              <MemoChordPalette chord={chord} />
            </div>
          ))}
        </div>

        {chords.length === 0 && !chordCollection.isLoading && (
          <p className="text-center py-7">
            No chords found. Try a different key/suffix combo.
          </p>
        )}
      </div>

      {chordCollection.data?.nextCursor && (
        <Button
          onClick={() => setCursor(chordCollection.data.nextCursor)}
          className="bg-transparent"
        >
          Load more
        </Button>
      )}
    </section>
  );
}
