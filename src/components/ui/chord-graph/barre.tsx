import { BarreType, FretXPositionType, OffsetType } from "BarreModule";
import React from "react";

const fretXPosition: FretXPositionType = {
  4: [10, 20, 30, 40, 50],
  6: [0, 10, 20, 30, 40, 50],
};

const fretYPosition = [2.35, 13.9, 26, 38];
const offset: OffsetType = {
  4: 0,
  6: -1,
};

const positions = {
  string: [50, 40, 30, 20, 10, 0],
  fret: [-4, 6.5, 18, 30, 42, 54],
  finger: [-3, 8, 19.5, 31.5, 43.5],
};

const getStringPosition = (string: number, strings: number) =>
  positions.string[string + offset[strings]];

const onlyBarres = (frets: number[], barre: number) => {
  const fretsOnly = frets.map((f, index) => ({ position: index, value: f }));
  if (frets.includes(barre)) {
    return fretsOnly.filter((f) => f.value === barre);
  } else return [{ position: -1, value: -1 }];
};

const Barre: React.FC<BarreType> = ({
  barre,
  frets,
  capo,
  finger,
  lite,
  baseFret = 1,
}) => {
  const strings = frets.length;
  const barreFrets = onlyBarres(frets, barre) || [{ position: 0, value: 0 }];

  const string1 = barreFrets[0].position || -1;
  const string2 = barreFrets[barreFrets.length - 1].position;
  const width = (string2 - string1) * 10;

  const relativeBarre = barre > 0 ? barre - baseFret + 1 : 0;
  const y = fretYPosition[relativeBarre - 1];

  return (
    <g>
      {capo && (
        <g>
          <g
            transform={`translate(${getStringPosition(strings, strings)}, ${
              positions && positions.fret[relativeBarre]
            })`}
          >
            <path
              d={`
            M 0, 0
            m -4, 0
            a 4,4 0 1,1 8,0
          `}
              fill="#555"
              fillOpacity={0.2}
              transform="rotate(-90)"
            />
          </g>
          <rect
            fill="#555"
            x={fretXPosition[strings][0]}
            y={y}
            width={(strings - 1) * 10}
            fillOpacity={0.2}
            height={8.25}
          />
          <g
            transform={`translate(${getStringPosition(1, strings)}, ${
              positions.fret[relativeBarre]
            })`}
          >
            <path
              d={`
            M 0, 0
            m -4, 0
            a 4,4 0 1,1 8,0
          `}
              fill="#555"
              fillOpacity={0.2}
              transform="rotate(90)"
            />
          </g>
        </g>
      )}
      {barreFrets &&
        barreFrets.map((fret) => {
          const relativeFret = fret.value > 0 ? fret.value - baseFret + 1 : 0;
          return (
            <circle
              key={fret.position && fret.position}
              strokeWidth="0.25"
              stroke="#444"
              fill="#444"
              cx={getStringPosition(strings - fret.position, strings)}
              cy={positions && positions.fret[relativeFret]}
              r={4}
            />
          );
        })}
      <rect
        fill="#444"
        x={fretXPosition[strings][string1]}
        y={y}
        width={width}
        height={8.25}
      />
      {!lite &&
        finger &&
        barreFrets.map((fret) => {
          const relativeFret = fret.value > 0 ? fret.value - baseFret + 1 : 0;
          return (
            <text
              key={fret.position}
              fontSize="3pt"
              fontFamily="Verdana"
              textAnchor="middle"
              fill="white"
              x={getStringPosition(strings - fret.position, strings)}
              y={positions.finger[relativeFret]}
            >
              {finger}
            </text>
          );
        })}
    </g>
  );
};

export default Barre;
