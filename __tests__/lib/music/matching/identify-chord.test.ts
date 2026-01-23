import { identifyChord } from "../../../../src/lib/music/matching/identify-chord";

describe("identify chords", () => {
  it("takes an array of ObservedNotes as an input and returns an array of best matched chords each containing root, suffix and score", () => {
    const input = [
      {
        stringIndex: 1,
        fret: 0,
        note: "a",
      },
      {
        stringIndex: 2,
        fret: 2,
        note: "e",
      },
      {
        stringIndex: 3,
        fret: 2,
        note: "a",
      },
      {
        stringIndex: 4,
        fret: 2,
        note: "c#",
      },
      {
        stringIndex: 5,
        fret: 0,
        note: "e",
      },
    ];
    const sortedChords = identifyChord(input);

    const result = sortedChords.sort(
      (chordA, chordB) => chordB.score - chordA.score,
    );
    expect(result[0].root).toEqual("a");
    expect(result[0].chordType).toEqual("major");
  });
});
