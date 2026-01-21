// hooks are just functions. "use" makes it behave like a hook

import { useEffect, useRef } from "react";

export function useIsFirstMount() {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
  }, []);

  return isFirstMount.current;
}
