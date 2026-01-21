import { useCallback } from "react";

export function useChordSearch(
  chordQuery: string,
  keys: string[],
  suffixes: string[],
) {
  let activeKey: string | "all" = "all";
  let activeSuffix: string | "all" = "all";

  const analyze = useCallback(() => {
    chordQuery = chordQuery.trim().toLowerCase();
    // Step 1: find key that matches the start
    // we sort because we wanna match the longest first. so between "C" and "C#" we get "C#"
    for (const k of keys
      .map((k) => k.toLowerCase())
      .sort((a, b) => b.length - a.length)) {
      if (chordQuery.startsWith(k)) {
        activeKey = k;
        chordQuery = chordQuery.slice(k.length); // remove key part
        break;
      }
    }

    for (const s of suffixes.sort((a, b) => b.length - a.length)) {
      //the remaining input is the suffix
      if (chordQuery.startsWith(s)) {
        activeSuffix = s;
        break;
      }
    }
    console.log({ activeKey, activeSuffix });
  }, [chordQuery]);

  return { analyze, activeKey, activeSuffix };
}
