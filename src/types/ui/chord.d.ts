export type ChordType = {
  id: string;
  key: string;
  suffix: string;
  frets: number[];
  barres: number[];
  capo: boolean;
  fingers: number[];
  baseFret: number;
  positions: ChordType[];
  description?: string;
};

export type InstrumentType = {
  tunings: {
    standard: string[];
  };
  strings: number;
  fretsOnChord: number;
};

export type ChordProps = {
  chord: ChordType;
  instrument: InstrumentType;
  lite?: boolean;
};
