import { identifyChord } from "../../../../src/lib/music/matching/identifyChord";

describe("identify chords", () => {
  it("takes an array of ObeservedNotes as an input and returns an array of best matched chords each containing root, suffix and score", () => {
    const input = [
      {
        stringIndex: 1,
        fret: 0,
        note: "A",
      },
      {
        stringIndex: 2,
        fret: 0,
        note: "D",
      },
      {
        stringIndex: 3,
        fret: 2,
        note: "A",
      },
      {
        stringIndex: 4,
        fret: 2,
        note: "C#",
      },
      {
        stringIndex: 5,
        fret: 0,
        note: "E",
      },
    ];

    const result = identifyChord(input);
    expect(result.slice(0, 4)).toEqual([
      {
        chordType: "5",
        root: "A",
        score: 16,
      },
      {
        chordType: "6",
        root: "A",
        score: 13,
      },
      {
        chordType: "7",
        root: "A",
        score: 13,
      },
      {
        chordType: "7sus4",
        root: "A",
        score: 13,
      },
    ]);
  });
});
