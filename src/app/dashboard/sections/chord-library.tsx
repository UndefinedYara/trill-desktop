"use client";

import { useEffect, useState } from "react";
import { useFindChordsByKeyAndSuffix } from "@/queries/chord/use-find-chords-by-key-and-suffixes";
import { Skeleton } from "@/components/ui/skeleton";
import { ChordType } from "@/types/ui/chord";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useChordSearch } from "@/hooks/use-chord-search";
import { searchChordsByDescription } from "@/app/actions/semantic-search";
import { ChordPalette } from "@/components/ui/chordpalette";
import { createVectorMap } from "@/lib/agent/utils/create-vector-map";

interface ChordLibraryProps {
  keys: string[];
  suffixes: string[];
}

export function ChordLibrary({ keys, suffixes }: ChordLibraryProps) {
  const [chordQuery, setChordQuery] = useState<string>("");
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [chords, setChords] = useState<ChordType[]>([]);
  const [aiChords, setAiChords] = useState<ChordType[]>([]);
  const [isAiSearching, setIsAiSearching] = useState(false);
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
          : chordCollection.data.data,
      );
    }
  }, [chordCollection.data, cursor]);
  async function handleSearch() {
    setCursor(undefined);
    setChords([]);
    setAiChords([]);

    if (!chordQuery.trim()) return;

    const { foundKey, foundSuffix } = analyze(chordQuery);

    if (foundKey === "all" && foundSuffix === "all") {
      setIsAiSearching(true);
      const queryVector = await createVectorMap(chordQuery);
      try {
        const results = await searchChordsByDescription(queryVector);
        setAiChords(results as ChordType[]);
      } catch (error) {
        console.error("Semantic search failed:", error);
      } finally {
        setIsAiSearching(false);
      }
    }
  }
  return (
    <section id="library" className="w-full my-12 pb-5 flex flex-col gap-10 ">
      <div className="flex flex-col items-center justify-center text-center space-y-3 mb-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tighter drop-shadow-lg">
          Chord <span className="text-red-500">Library</span>
        </h2>
        <p className="text-base md:text-lg text-white/60 font-medium max-w-xl mx-auto">
          Discover more chords, positions, keys, and more.
        </p>
      </div>

      <div className="relative flex w-full max-w-4xl group mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-gray-500 rounded-full blur opacity-25 group-focus-within:opacity-75 transition duration-500 group-hover:opacity-75"></div>
        <div className="relative flex w-full items-center bg-black/40 backdrop-blur-md rounded-full p-1 shadow-2xl focus-within:ring-red-500 transition-all">
          <Input
            fieldName={"Search"}
            placeholder={"Try 'Cmaj7' or 'A bright happy sound'..."}
            type={"text"}
            value={chordQuery}
            onChange={(e) => setChordQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            className="w-full border-0 focus-visible:ring-0 shadow-none bg-transparent rounded-l-full px-6 py-4 text-lg flex-1 text-white placeholder:text-gray-400"
          />
          <Button
            type="button"
            className="rounded-full px-5 py-5 text-lg font-medium transition-all bg-primary hover:bg-primary/90 text-white "
            onClick={handleSearch}
            disabled={isAiSearching}
          >
            {isAiSearching ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </div>
      <div className="md:gap-5 col-span-10 md:col-span-9 mt-5">
        {(chordCollection.isLoading || isAiSearching) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <Skeleton className="h-92 w-full rounded-xl" />
            <Skeleton className="h-92 w-full rounded-xl" />
          </div>
        )}

        {chordCollection.isError && (
          <div className="flex items-center justify-center h-40">
            <p>No chords found.</p>
          </div>
        )}

        {aiChords.length > 0 && (
          <div className="flex items-center gap-2 mb-6 text-blue-500 font-medium animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-5 h-5" />
            <p>AI Vibe Matches for "{chordQuery}"</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-12">
          {(aiChords.length > 0 ? aiChords : chords).map((chord: ChordType, index) => {
            return (
              <div key={chord.key + chord.suffix + index} className="animate-in fade-in zoom-in-95 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                <ChordPalette chord={chord} />
              </div>
            )
          })}
        </div>

        {chords.length === 0 && aiChords.length === 0 && !chordCollection.isLoading && !isAiSearching && (
          <p className="text-center py-7 text-muted-foreground">
            No chords found. Try a different key/suffix combo, or a descriptive vibe.
          </p>
        )}
      </div>

      {chordCollection.data?.nextCursor && aiChords.length === 0 && (
        <Button
          onClick={() => setCursor(chordCollection.data.nextCursor)}
          className="bg-transparent flex w-1/3 mx-auto py-5 rounded-xl font-bold"
        >
          Load more
        </Button>
      )}
    </section>
  );
}
