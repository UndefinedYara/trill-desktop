declare module "ChordModule" {
  type ChordType = {
    id: ?number;
    key: string;
    suffix: string;
    frets: number[];
    barres?: number[];
    capo?: boolean;
    fingers?: number[];
    baseFret: number;
    positions: ChordType[];
  };

  type InstrumentType = {
    tunings: {
      standard: string[];
    };
    strings: number;
    fretsOnChord: number;
  };

  type ChordProps = {
    chord: any;
    instrument: InstrumentType;
    lite?: boolean;
  };
}
