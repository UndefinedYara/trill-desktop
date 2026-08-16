import Chord from "./chord-graph/chord";
import { Guitar } from "@/lib/instrument/guitar";
import { ButtonLeft } from "./icons/button-left";
import { ButtonRight } from "./icons/button-right";
import { useState } from "react";
import { ChordType } from "@/types/ui/chord";
import { Sparkles } from "lucide-react";

interface ChordPaletteProps {
  chord: {
    key: string;
    suffix: string;
    positions: ChordType[];
    score?: number;
    topScore?: number;
    description?: string;
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
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 md:p-6  flex flex-col md:flex-row gap-6 ">
      {/* Left side: Fretboard Diagram */}
      <div className="flex flex-col items-center flex-shrink-0 bg-black/20 rounded-2xl p-6 md:p-4 ring-1 ring-white/5">
        <Chord chord={chord.positions[counter]} instrument={Guitar} />

        {/* Navigation */}
        <div className="flex items-center gap-4 mt-4 text-white/50">
          <ButtonLeft onClick={backward} width={24} />
          <p className="text-sm font-medium tracking-widest">{counter + 1} / {chord.positions.length}</p>
          <ButtonRight onClick={forward} width={24} />
        </div>
      </div>

      {/* Right side: Chord Info & Vibe */}
      <div className="flex flex-col justify-center py-2 flex-1">
        <div className="mb-4">
          <p className="text-xl md:text-2xl font-thin text-white capitalize tracking-tighter drop-shadow-md">
            {chord.key}<span className="text-red-500">{chord.suffix}</span>
          </p>
          {chord.score && (
            <p className="text-xs uppercase tracking-wide text-white/40 mt-1 font-bold">
              {scoreRating(chord.score)}
            </p>
          )}
        </div>

        {chord.description && (
          <div className=" pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-red-400" />
              <span className="text-xs uppercase tracking-wide text-red-400 font-bold">AI Vibe Analysis</span>
            </div>
            <p className="text-md md:text-lg text-white/80 font-medium italic leading-relaxed">
              "{chord.description}"
            </p>
          </div>
        )}
      </div>
    </div>


  );
}
