import { PAGE_LIMIT } from "@/consts";
import { convertChordNotation } from "@/lib/music/helpers/convert-chord-notation";
import { useQuery } from "@tanstack/react-query";

export const useFindChordsByKeyAndSuffix = (
  key: string,
  suffix: string,
  cursor?: string,
) => {
  return useQuery<any, any>({
    queryKey: ["chords", key, suffix, cursor],

    queryFn: async () => {
      const cleanKey = convertChordNotation(key);
      const cleanSuffix = convertChordNotation(suffix);
      const params = new URLSearchParams({
        key: cleanKey,
        suffix: cleanSuffix,
      });
      if (cursor) {
        params.set("cursor", cursor);
      }
      const result = await fetch(`/api/chord/find-by-key-suffix?${params}`);
      const response = await result.json();
      return { data: response.data, nextCursor: response.nextCursor };
    },
    enabled: !!key && !!suffix,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
