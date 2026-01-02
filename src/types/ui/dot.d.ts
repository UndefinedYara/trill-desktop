declare module "DotModule" {
  type DotType = {
    string: number;
    fret: number;
    finger: number;
    strings: number;
    lite: boolean;
    baseFret?: number;
  };

  interface OffsetsProp {
    [key: number]: number;
  }
}
