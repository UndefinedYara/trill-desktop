type TransformedChord = {
  key: string;
  suffix: string;
  positions: {
    frets: number[];
    fingers: number[];
    barres: number[];
    capo: boolean;
  }[];
};
