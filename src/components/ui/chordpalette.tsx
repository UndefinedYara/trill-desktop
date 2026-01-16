import Chord from "./chord-graph/chord";
import { Guitar } from "@/lib/instrument/guitar";
import { ButtonLeft } from "./icons/button-left";
import { ButtonRight } from "./icons/button-right";
import { useState } from "react";
import { ChordType } from "@/types/ui/chord";

interface ChordPaletteProps {
  chord: {
    key: string;
    suffix: string;
    positions: ChordType[];
    score?: number;
    topScore?: number;
  };
}

export function ChordPalette({ chord }: ChordPaletteProps) {
  const [counter, setCounter] = useState<number>(0);

  function backward() {
    if (counter > 0) setCounter((counter) => counter - 1);
  }

  function forward() {
    if (counter < chord.positions.length - 1)
      setCounter((counter) => counter + 1);
  }

  function scoreRating(score: number): string {
    if (!chord.topScore) return "";
    let scorePercentage = (score / chord.topScore) * 100;
    if (scorePercentage > 90) return "Best Match";
    if (scorePercentage > 75 && scorePercentage < 90)
      return "Closely Related Chord";
    if (scorePercentage < 75) return "Possible Alternative";

    return "";
  }

  return (
    <div className="bg-white/3 rounded-2xl p-3 flex justify-center items-center">
      <div className="flex flex-col w-full items-center ">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-xl text-white/80">
            {chord.key + " " + chord.suffix}
          </p>
          <p className="text-sm text-white/15">
            {scoreRating(chord.score || 0)}
          </p>
        </div>
        <Chord chord={chord.positions[counter]} instrument={Guitar} />
        <div className="flex gap-2">
          <ButtonLeft onClick={backward} width={25}></ButtonLeft>
          <p>{counter + 1 + " of " + chord.positions.length} </p>
          <ButtonRight onClick={forward} width={25}></ButtonRight>
        </div>
      </div>
    </div>
  );
}
