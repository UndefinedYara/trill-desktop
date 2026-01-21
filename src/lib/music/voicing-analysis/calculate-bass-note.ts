import { ObservedNote } from "@/types/ui/observed-note";

export function calculateBassNote(noteObjects: ObservedNote[]): string | null {
  const sounding = noteObjects.filter((n) => n.note !== null);
  if (sounding.length === 0) return null;

  const bass = sounding.sort((a, b) => {
    if (a.stringIndex !== b.stringIndex) {
      return a.stringIndex - b.stringIndex; // lower string first
    }
    return a.fret - b.fret; // lower fret first
  })[0];

  return bass.note;
}
