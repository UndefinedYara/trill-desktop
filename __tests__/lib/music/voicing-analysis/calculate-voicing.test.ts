import { CalculateVoicing } from "../../../../src/lib/music/voicing-analysis/calculate-voicing";

describe("calculate voicing", () => {
  it("takes an array of ObservedNotes and an array of ChordMatches and returns a new calculated root if the base note of the chord is not the same as the root note", () => {
    const observedNotes = [
      {
        stringIndex: 0,
        fret: 3,
        note: "g",
      },
      {
        stringIndex: 1,
        fret: 3,
        note: "c",
      },
      {
        stringIndex: 2,
        fret: 2,
        note: "e",
      },
      {
        stringIndex: 3,
        fret: 0,
        note: "g",
      },
      {
        stringIndex: 4,
        fret: 1,
        note: "c",
      },
      {
        stringIndex: 5,
        fret: 0,
        note: "e",
      },
    ];

    const chordMatches = [
      {
        root: "c",
        chordType: "major",
        score: 50,
        formula: [0, 4, 7],
      },
    ];

    const result = CalculateVoicing(observedNotes, chordMatches);
    expect(result[0].root).toEqual("c/g");
  });

  it("takes an array of ObservedNotes and an array of ChordMatches and returns the root if the base note and the root are the same", () => {
    const observedNotes = [
      {
        stringIndex: 0,
        fret: 3,
        note: "g",
      },
      {
        stringIndex: 1,
        fret: 2,
        note: "b",
      },
      {
        stringIndex: 2,
        fret: 0,
        note: "d",
      },
      {
        stringIndex: 3,
        fret: 0,
        note: "g",
      },
      {
        stringIndex: 4,
        fret: 0,
        note: "b",
      },
      {
        stringIndex: 5,
        fret: 3,
        note: "g",
      },
    ];

    const chordMatches = [
      {
        root: "g",
        chordType: "major",
        score: 50,
        formula: [0, 4, 7],
      },
    ];

    const result = CalculateVoicing(observedNotes, chordMatches);
    expect(result[0].root).toEqual("g");
  });
});
