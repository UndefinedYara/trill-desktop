import { CalculateVoicing } from "../../../../src/lib/music/voicing-analysis/calculate-voicing";

describe("calculate voicing", () => {
  it("takes an array of ObservedNotes and an array of ChordMatches and returns a new calculated root if the base note of the chord is not the same as the root note", () => {
    const observedNotes = [
      {
        stringIndex: 0,
        fret: 3,
        note: "G",
      },
      {
        stringIndex: 1,
        fret: 3,
        note: "C",
      },
      {
        stringIndex: 2,
        fret: 2,
        note: "E",
      },
      {
        stringIndex: 3,
        fret: 0,
        note: "G",
      },
      {
        stringIndex: 4,
        fret: 1,
        note: "C",
      },
      {
        stringIndex: 5,
        fret: 0,
        note: "E",
      },
    ];

    const chordMatches = [
      {
        root: "C",
        chordType: "major",
        score: 50,
        formula: [0, 4, 7],
      },
    ];

    const result = CalculateVoicing(observedNotes, chordMatches);
    expect(result[0].root).toEqual("C/G");
  });

  it("takes an array of ObservedNotes and an array of ChordMatches and returns the root if the base note and the root are the same", () => {
    const observedNotes = [
      {
        stringIndex: 0,
        fret: 3,
        note: "G",
      },
      {
        stringIndex: 1,
        fret: 2,
        note: "B",
      },
      {
        stringIndex: 2,
        fret: 0,
        note: "D",
      },
      {
        stringIndex: 3,
        fret: 0,
        note: "G",
      },
      {
        stringIndex: 4,
        fret: 0,
        note: "B",
      },
      {
        stringIndex: 5,
        fret: 3,
        note: "G",
      },
    ];

    const chordMatches = [
      {
        root: "G",
        chordType: "major",
        score: 50,
        formula: [0, 4, 7],
      },
    ];

    const result = CalculateVoicing(observedNotes, chordMatches);
    expect(result[0].root).toEqual("G");
  });
});
