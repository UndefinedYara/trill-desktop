import { useState, useEffect } from "react";

/**
 * Returns a debounced value that only updates after `delay` ms
 * @param value - the value to debounce
 * @param delay - debounce delay in ms (default 500ms)
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    // cleanup if value changes before delay
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
