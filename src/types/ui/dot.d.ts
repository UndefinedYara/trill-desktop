declare module "DotModule" {
  type DotType = {
    string: number;
    fret: number;
    finger: 0 | 1 | 2 | 3 | 4 | 5;
    strings: number;
    lite: boolean;
    baseFret?: number;
  };

  interface OffsetsProp {
    [key: number]: number;
  }
}
