import { ENHARMONIC_MAP } from "./enharmonic-map";

export function toEnharmonicNote(note: string): string {
  return ENHARMONIC_MAP[note] || note;
}
