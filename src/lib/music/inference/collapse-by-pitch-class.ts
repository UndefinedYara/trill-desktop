import { ObservedNote } from "@/types/ui/observed-note";

export function collapseByPitchClass(notes: ObservedNote[]): ObservedNote[] {
  const seen = new Set<string>();

  return notes.filter((note) => {
    if (seen.has(note.note)) return false;
    seen.add(note.note);
    return true;
  });
}
