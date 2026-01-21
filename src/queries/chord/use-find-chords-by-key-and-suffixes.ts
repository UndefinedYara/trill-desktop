import { convertChordNotation } from "@/lib/music/helpers/convert-chord-notation";
import { useQuery } from "@tanstack/react-query";

export const useFindChordsByKeyAndSuffix = (key: string, suffix: string) => {
  return useQuery<any, any>({
    queryKey: [key, suffix],

    queryFn: async () => {
      const cleanKey = convertChordNotation(key);
      const cleanSuffix = convertChordNotation(suffix);
      const params = new URLSearchParams({
        key: cleanKey,
        suffix: cleanSuffix,
      });
      const result = await fetch(`/api/chord/find-by-key-suffix?${params}`);
      const response = await result.json();
      return response.data;
    },
    enabled: !!key && !!suffix,
  });
};
