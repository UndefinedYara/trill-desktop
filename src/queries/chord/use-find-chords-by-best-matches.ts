import { findChordsByKeyAndSuffix } from "@/app/actions/chord-queries";
import { convertChordNotation } from "@/lib/music/helpers/convert-chord-notation";
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

        const result = await findChordsByKeyAndSuffix(cleanKey, cleanSuffix);
        return result.data
      });

      const responses = (await Promise.all(requests)).flat();

      return responses;
    },
    enabled: bestMatches.length > 0,
  });
};
