import { Suspense } from "react";
import { ChordLibrary } from "./sections/chord-library";
import { Fretboard } from "./sections/fretboard";
import { Loading } from "@/components/ui/loading";
import { getChordKeys, getChordSuffixes } from "../actions/chord-queries";
import { SwitchToWideScreenCTA } from "@/components/ui/switch-to-wide-screen-cta";
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
    <section className="px-5 lg:px-8 max-w-7xl mx-auto pt-25 pb-20 w-full h-full flex flex-col gap-24 select-none">
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
