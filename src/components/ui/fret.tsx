"use client";

import { cn } from "@/lib/utils";
import { String } from "./string";
import { useEffect, useRef, useState } from "react";
import { useIsFirstMount } from "@/hooks/useIsFirstMount";
import { FRET_DOT_WIDTH } from "./consts";

interface FretProps {
  className?: string;
  fretNumber: number;
  marker?: boolean;
  doubleMarker?: boolean;
  style: React.CSSProperties;
  mutedStrings: number[];
  fretAndStringsArray: [number, number][];
  setFretAndStringsArray: React.Dispatch<
    React.SetStateAction<[number, number][]>
  >;
}

export function Fret({
  className,
  fretNumber,
  marker,
  doubleMarker,
  style,
  mutedStrings,
  fretAndStringsArray,
  setFretAndStringsArray,
}: FretProps) {
  const [middlePoint, setMiddlePoint] = useState(10);

  const ref = useRef<HTMLDivElement>(null);
  const isFirstMount = useIsFirstMount();

  useEffect(() => {
    if (isFirstMount) {
      const dot =
        ref.current!.getBoundingClientRect().width / 2 - FRET_DOT_WIDTH;
      setMiddlePoint(dot);
      return;
    }
  }, [middlePoint]);

  return (
    <div
      style={style}
      ref={ref}
      className={cn(
        "relative h-36 border border-gray-700 flex flex-col-reverse gap-3",
        className
      )}
    >
      {new Array(6).fill(0).map((_, index) => {
        return (
          <String
            key={index}
            stringNumber={index + 1}
            fretNumber={fretNumber}
            fretAndStringsArray={fretAndStringsArray}
            setFretAndStringsArray={setFretAndStringsArray}
            mutedStrings={mutedStrings}
          />
        );
      })}
      {marker && (
        <div
          className="absolute top-16  h-4 w-4 rounded-full bg-white"
          style={{ left: `${middlePoint}px` }}
        />
      )}
      {doubleMarker && (
        <>
          <div
            className="absolute top-[27px]  h-4 w-4 rounded-full bg-white"
            style={{ left: `${middlePoint}px` }}
          />
          <div
            className="absolute  top-[98px]   h-4 w-4 rounded-full bg-white"
            style={{ left: `${middlePoint}px` }}
          />
        </>
      )}
    </div>
  );
}
