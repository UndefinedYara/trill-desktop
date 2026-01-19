import { Suspense } from "react";
import { ChordLibrary } from "./sections/chordlibrary";
import { Fretboard } from "./sections/fretboard";
import { Loading } from "@/components/ui/loading";
import { getChordKeys, getChordSuffixes } from "../actions/chord-queries";
export default async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <MainSection />
    </Suspense>
  );
}

async function MainSection() {
  const searchData = await getChordSearchData();
  return (
    <section className="px-2 md:px-20 pt-25 pb-20 w-full h-full flex flex-col gap-16 ">
      <Fretboard />
      <ChordLibrary keys={searchData.keys} suffixes={searchData.suffixes} />
    </section>
  );
}

async function getChordSearchData() {
  const [keys, suffixes] = await Promise.all([
    getChordKeys(),
    getChordSuffixes(),
  ]);
  return { keys, suffixes };
}
