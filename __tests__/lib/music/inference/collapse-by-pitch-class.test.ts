import { collapseByPitchClass } from "../../../../src/lib/music/inference/collapse-by-pitch-class";

describe("collapse by pitch class", () => {
  it("takes an array of ObservedNotes as an input and returns a set of unique notes", () => {
    const input = [
      {
        stringIndex: 1,
        fret: 0,
        note: "a",
      },
      {
        stringIndex: 2,
        fret: 0,
        note: "d",
      },
      {
        stringIndex: 3,
        fret: 2,
        note: "a",
      },

      {
        stringIndex: 0,
        fret: 0,
        note: "a",
      },
      {
        stringIndex: 4,
        fret: 0,
        note: "e",
      },
    ];

    const result = collapseByPitchClass(input);
    expect(result).toEqual([
      {
        stringIndex: 1,
        fret: 0,
        note: "a",
      },
      {
        stringIndex: 2,
        fret: 0,
        note: "d",
      },
      {
        stringIndex: 4,
        fret: 0,
        note: "e",
      },
    ]);
  });
});
