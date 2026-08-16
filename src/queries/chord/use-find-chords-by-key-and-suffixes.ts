import { PAGE_LIMIT } from "@/consts";
import { useQuery } from "@tanstack/react-query";
import { findChordsByKeyAndSuffix } from "@/app/actions/chord-queries";

export const useFindChordsByKeyAndSuffix = (
  key: string,
  suffix: string,
  cursor: string | undefined,
) => {
  return useQuery<any, any>({
    queryKey: ["chords", key, suffix, cursor],

    queryFn: async () => {
      const result = await findChordsByKeyAndSuffix(key, suffix, cursor);
      return result;
    },
    enabled: !!key && !!suffix,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
