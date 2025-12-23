import { convertChordNotation } from "@/lib/music/helpers/convertChordNotation";
import { useQuery } from "@tanstack/react-query";

export const useFindChordsByBestMatches = (
  bestMatches: { root: string; chordType: string }[]
) => {
  return useQuery({
    queryKey: ["chords", bestMatches],
    queryFn: async () => {
      const requests = bestMatches.map(async (match) => {
        const cleanKey = convertChordNotation(match.root);
        const cleanSuffix = convertChordNotation(match.chordType);

        const params = new URLSearchParams({
          key: cleanKey,
          suffix: cleanSuffix,
        });

        const result = await fetch(`/api/chord/find-by-key-suffix?${params}`);
        const data = await result.json();

        return data.data;
      });

      const responses = (await Promise.all(requests)).flat();

      return responses;
    },
    enabled: bestMatches.length > 0,
  });
};
