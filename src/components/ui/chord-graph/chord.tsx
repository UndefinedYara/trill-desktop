import React from "react";
import { ChordProps, ChordType } from "ChordModule";
import Neck from "./neck";
import Dot from "./dot";
import Barre from "./barre";

const onlyDots = (chord: ChordType) => {
  return chord.frets
    .map((f, index) => ({ position: index, value: f }))
    .filter((f) => !chord.barres || chord.barres.indexOf(f.value) === -1);
};

const Chord: React.FC<ChordProps> = ({ chord, instrument, lite = false }) => {
  const fretsInChord = chord.frets.filter((fret: number) => fret > 0);
  const baseFret = fretsInChord.length ? Math.min(...fretsInChord) : 1;

  return chord ? (
    <svg
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMinYMin meet"
      viewBox="0 0 80 70"
    >
      <g transform="translate(13, 10)">
        <Neck
          tuning={instrument.tunings.standard}
          strings={instrument.strings}
          frets={chord.frets}
          capo={chord.capo}
          fretsOnChord={instrument.fretsOnChord}
          baseFret={baseFret}
          lite={lite}
        />

        {chord.barres &&
          chord.barres.map((barre: number, index: number) => (
            <Barre
              key={index}
              capo={index === 0 && chord.capo}
              barre={barre}
              finger={
                chord.fingers && chord.fingers[chord.frets.indexOf(barre)]
              }
              frets={chord.frets}
              lite={lite}
              baseFret={baseFret}
            />
          ))}
        {onlyDots(chord).map((fret) => (
          <Dot
            key={fret.position}
            string={instrument.strings - fret.position}
            fret={fret.value}
            strings={instrument.strings}
            finger={chord.fingers && chord.fingers[fret.position]}
            lite={lite}
            baseFret={baseFret}
          />
        ))}
      </g>
    </svg>
  ) : null;
};

export default Chord;
