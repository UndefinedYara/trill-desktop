import { transformChord } from "../../../scripts/seed/helpers/transform-chords";
import { ASCII_OFFSET_FOR_LETTER_FRETS } from "../../../scripts/consts";

describe("transformChord", () => {
  it("normalizes frets, fingers, barres, and capo correctly", () => {
    const input = {
      key: "C",
      suffix: "maj",
      positions: [
        {
          frets: "x32010",
          fingers: "032010",
          barres: 3,
          capo: undefined,
        },
        {
          frets: "ab12x0",
          fingers: "123450",
          barres: [1, 2],
          capo: true,
        },
      ],
    };

    const result = transformChord(input);

    expect(result).toEqual({
      key: "C",
      suffix: "maj",
      positions: [
        {
          frets: [-1, 3, 2, 0, 1, 0],
          fingers: [0, 3, 2, 0, 1, 0],
          barres: [3],
          capo: false,
        },
        {
          frets: [10, 11, 1, 2, -1, 0],
          fingers: [1, 2, 3, 4, 5, 0],
          barres: [1, 2],
          capo: true,
        },
      ],
    });
  });

  it("handles missing barres and capo safely", () => {
    const input = {
      key: "D",
      suffix: "min",
      positions: [
        {
          frets: "xx0231",
          fingers: "000231",
        },
      ],
    };

    const result = transformChord(input);

    expect(result.positions[0].barres).toEqual([]);
    expect(result.positions[0].capo).toBe(false);
  });
});
