import { useCallback, useState } from "react";

export function useChordSearch(keys: string[], suffixes: string[]) {
  const [activeKey, setActiveKey] = useState<string | "all">("all");
  const [activeSuffix, setActiveSuffix] = useState<string | "all">("all");

  const analyze = useCallback(
    (chordQuery: string) => {
      let newQuery = chordQuery.trim().toLowerCase();
      let foundKey: string | "all" = "all";
      // Step 1: find key that matches the start
      // we sort because we wanna match the longest first. so between "c" and "c#" we get "c#"
      for (const k of keys.map((k) => k).sort((a, b) => b.length - a.length)) {
        if (newQuery.trim().startsWith(k)) {
          foundKey = k;
          newQuery = newQuery.slice(k.length); // remove key part
          break;
        }
      }

      let foundSuffix: string | "all" = "all";
      for (const s of suffixes.sort((a, b) => b.length - a.length)) {
        //the remaining input is the suffix
        if (newQuery.trim().startsWith(s)) {
          foundSuffix = s;
          break;
        }
      }

      setActiveKey(foundKey);
      setActiveSuffix(foundSuffix);

      return { foundKey, foundSuffix };
    },
    [keys, suffixes],
  );

  return { analyze, activeKey, activeSuffix };
}
