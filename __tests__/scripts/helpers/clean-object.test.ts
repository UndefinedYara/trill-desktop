import { getCleanObject } from "../../../scripts/seed/helpers/clean-object";

describe("clean objects", () => {
  it("takes TypeScript/JS file content and turns it into a js object.", () => {
    const input = `export default {
        key: 'G',
        suffix: '/Ab',
        positions: [
            {
            frets: '420003',
            fingers: '310002',
            },
            {
            frets: '420033',
            fingers: '310022',
            barres: 3,
            },
            {
            frets: 'xx6433',
            fingers: '004211',
            barres: 3,
            capo: true,
            },
            {
            frets: 'xx6787',
            fingers: '001243',
            },
        ],
        };
    `;

    const result = getCleanObject(input);
    expect(result).toEqual({
      key: "G",
      suffix: "/Ab",
      positions: [
        {
          frets: "420003",
          fingers: "310002",
        },
        {
          frets: "420033",
          fingers: "310022",
          barres: 3,
        },
        {
          frets: "xx6433",
          fingers: "004211",
          barres: 3,
          capo: true,
        },
        {
          frets: "xx6787",
          fingers: "001243",
        },
      ],
    });
  });
});
