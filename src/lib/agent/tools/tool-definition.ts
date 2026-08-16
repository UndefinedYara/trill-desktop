import { CHORD_FORMULAS } from "@/lib/music";

export const saveChordTool = {
  type: "function",
  function: {
    name: "store_chord_info",
    description:
      "Store detailed information about a musical chord in the database so that it can be retrieved later. Trigger this when a user explicitly asks to save or store a chord.",
    parameters: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description:
            "A unique identifier string for this chord (use Object(id). Similar to what firebase uses).",
        },
        key: {
          type: "string",
          description: "The root note of the chord, e.g., 'C', 'F#', 'Bb'.",
        },
        suffix: {
          type: "string",
          description: `The chord quality or extension, e.g., 'major', 'min7', 'dim', 'maj9', etc. Please abide by these intervals and their naming conventions ${CHORD_FORMULAS}. Meaning use "dim" instead of "diminished", "aug" instead of "augmented", etc.`,
        },
        positions: {
          type: "object",
          description:
            "The physical fretboard positioning details for playing the chord.",
          properties: {
            barres: {
              type: "array",
              items: { type: "integer" },
              description:
                "Fret numbers where a finger bars multiple strings. Leave empty if none.",
            },
            frets: {
              type: "array",
              items: { type: "integer" },
              description:
                "The fret number for each string from lowest string to highest string. Use -1 for muted strings.",
            },
            fingers: {
              type: "array",
              items: { type: "integer" },
              description:
                "The finger number (1-4) used for each string. Use 0 for open/unfretted strings.",
            },
            capo: {
              type: "boolean",
              description:
                "True if a capo is required for this specific position.",
            },
          },
          required: ["barres", "frets", "fingers"],
        },
      },
      required: ["id", "key", "suffix", "positions"],
    },
  },
};
