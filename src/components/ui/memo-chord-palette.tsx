import React from "react";
import { ChordType } from "@/types/ui/chord";
import { ChordPalette } from "@/components/ui/chordpalette";

export const MemoChordPalette = React.memo(function MemoChordPalette({
  chord,
}: {
  chord: ChordType;
}) {
  return <ChordPalette chord={chord} />;
});
