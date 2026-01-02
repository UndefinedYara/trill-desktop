declare module "BarreModule" {
  type BarreType = {
    frets: [];
    barre: number;
    capo: boolean;
    lite: boolean;
    finger: 0 | 1 | 2 | 3 | 4 | 5;
    baseFret: number;
  };

  type FretXPositionType = {
    [key: number]: number[];
  };

  type OffsetType = {
    [key: number]: number;
  };
}
