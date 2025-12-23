declare module "NeckModules" {
  type Offsets = {
    [key: number]: {
      x: number;
      y: number;
      length: number;
    };
  };

  interface NeckProps {
    tuning: string[];
    frets: number[];
    capo?: boolean;
    strings: number;
    baseFret: number;
    fretsOnChord: number;
    lite?: boolean;
  }
}
