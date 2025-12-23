import { Dispatch, SetStateAction } from "react";

interface StringProps {
  stringNumber: number;
  fretNumber: number;
  mutedStrings: number[];
  fretAndStringsArray: [number, number][];
  setFretAndStringsArray: Dispatch<SetStateAction<[number, number][]>>;
}
export function String({
  stringNumber,
  fretNumber,
  mutedStrings,
  fretAndStringsArray,
  setFretAndStringsArray,
}: StringProps) {
  const muted = mutedStrings.includes(stringNumber);
  const isActive = fretAndStringsArray.some(
    ([string, fret]) => string === stringNumber && fret === fretNumber
  );

  function handleClick() {
    setFretAndStringsArray((currentArray) => {
      const isCurrentlyActive = currentArray.some(
        ([string, fret]) => string === stringNumber && fret === fretNumber
      );
      const filteredArray = currentArray.filter(
        ([string]) => string !== stringNumber
      );
      if (!isCurrentlyActive) {
        return [...filteredArray, [stringNumber, fretNumber]];
      }
      return filteredArray;
    });
  }

  return (
    <div
      className="relative w-full h-3 border-white hover:border-red-700 hover:cursor-pointer"
      style={{
        borderTopWidth: `${stringNumber - 0.8}px`,
        borderTopStyle: "solid",
        ...(isActive && !muted && { borderTopColor: "#ae1a12" }),
      }}
      onClick={() => {
        handleClick();
      }}
    ></div>
  );
}
