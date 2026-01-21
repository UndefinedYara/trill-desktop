import { identifyChord } from "../../../../src/lib/music/matching/identify-chord";

describe("identify chords", () => {
  it("takes an array of ObservedNotes as an input and returns an array of best matched chords each containing root, suffix and score", () => {
    const input = [
      {
        stringIndex: 1,
        fret: 0,
        note: "A",
      },
      {
        stringIndex: 2,
        fret: 2,
        note: "E",
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
    const sortedChords = identifyChord(input);

    const result = sortedChords.sort(
      (chordA, chordB) => chordB.score - chordA.score,
    );
    expect(result[0].root).toEqual("A");
    expect(result[0].chordType).toEqual("major");
  });
});
