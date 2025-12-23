import { ENHARMONIC_MAP } from "./enharmonicMap";

export function toEnharmonicNote(note: string): string {
  return ENHARMONIC_MAP[note] || note;
}
