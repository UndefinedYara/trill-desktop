type OriginalChord = {
  key: string;
  suffix: string;
  positions: {
    frets: string;
    fingers: string;
    barres?: number | number[];
    capo?: boolean;
  }[];
};
