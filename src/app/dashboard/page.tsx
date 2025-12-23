import { ChordLibrary } from "./sections/chordlibrary";
import { Fretboard } from "./sections/fretboard";
import { getChordKeys, getChordSuffixes } from "@/lib/firebase/chord-queries";
export default async function Page({}) {
  const searchData = await getChordSearchData();
  return (
    <section className="indent pt-25 pb-20 w-full h-full flex flex-col gap-16 ">
      <Fretboard />
      <ChordLibrary keys={searchData.keys} suffixes={searchData.suffixes} />
    </section>
  );
}

async function getChordSearchData() {
  try {
    const [keys, suffixes] = await Promise.all([
      getChordKeys(),
      getChordSuffixes(),
    ]);
    return { keys, suffixes };
  } catch (error) {
    console.error(error);
    return { keys: [], suffixes: [] };
  }
}
