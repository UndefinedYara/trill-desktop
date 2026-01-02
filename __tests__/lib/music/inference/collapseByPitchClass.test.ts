import { collapseByPitchClass } from "../../../../src/lib/music/inference/collapseByPitchClass";

describe("collapse by pitch class", () => {
  it("takes an array of ObeservedNotes as an input and returns a set of unique notes", () => {
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
        stringIndex: 0,
        fret: 0,
        note: "E",
      },
      {
        stringIndex: 4,
        fret: 0,
        note: "E",
      },
    ];

    const result = collapseByPitchClass(input);
    expect(result).toEqual([
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
        stringIndex: 0,
        fret: 0,
        note: "E",
      },
    ]);
  });
});
