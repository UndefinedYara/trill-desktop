declare module "BarreModule" {
  type BarreType = {
    frets: number[];
    barre: number;
    capo: boolean;
    lite: boolean;
    finger: number;
    baseFret: number;
  };

  type FretXPositionType = {
    [key: number]: number[];
  };

  type OffsetType = {
    [key: number]: number;
  };
}
