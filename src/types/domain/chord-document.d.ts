
export interface ChordDocument {
  id: string;
  key: string;
  suffix: string;
  positions: {
    barres: number[];
    frets: number[];
    fingers: number[];
    capo?: boolean;
  };
  vector: number[];
}
