import { useChordSearch } from "../../src/hooks/use-chord-search";
import { renderHook, act } from "@testing-library/react";

const keys = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
const suffixes = ["maj", "min", "dim", "aug", "maj7", "min7", "7"];

describe("useChordSearch", () => {
  it("should return the initial state", () => {
    const { result } = renderHook(() => useChordSearch(keys, suffixes));

    expect(result.current.activeKey).toBe("all");
    expect(result.current.activeSuffix).toBe("all");
  });

  it("should parse a simple chord string", () => {
    const { result } = renderHook(() => useChordSearch(keys, suffixes));

    act(() => {
      result.current.analyze("cmaj7");
    });

    expect(result.current.activeKey).toBe("c");
    expect(result.current.activeSuffix).toBe("maj7");
  });

  it("should parse a chord with a sharp key", () => {
    const { result } = renderHook(() => useChordSearch(keys, suffixes));

    act(() => {
      result.current.analyze("f#min7");
    });

    expect(result.current.activeKey).toBe("f#");
    expect(result.current.activeSuffix).toBe("min7");
  });

  it("should handle queries that do not match a key", () => {
    const { result } = renderHook(() => useChordSearch(keys, suffixes));

    act(() => {
      result.current.analyze("xmaj7");
    });

    expect(result.current.activeKey).toBe("all");
    expect(result.current.activeSuffix).toBe("all");
  });

  it("should handle queries with a valid key but no matching suffix", () => {
    const { result } = renderHook(() => useChordSearch(keys, suffixes));

    act(() => {
      result.current.analyze("cblah");
    });

    expect(result.current.activeKey).toBe("c");
    expect(result.current.activeSuffix).toBe("all");
  });

  it("should handle an empty query", () => {
    const { result } = renderHook(() => useChordSearch(keys, suffixes));

    act(() => {
      result.current.analyze("cmaj7");
    });

    expect(result.current.activeKey).toBe("c");
    expect(result.current.activeSuffix).toBe("maj7");

    act(() => {
      result.current.analyze("");
    });

    expect(result.current.activeKey).toBe("all");
    expect(result.current.activeSuffix).toBe("all");
  });

  it("should be case-insensitive", () => {
    const { result } = renderHook(() => useChordSearch(keys, suffixes));

    act(() => {
      result.current.analyze("CMAJ7");
    });

    expect(result.current.activeKey).toBe("c");
    expect(result.current.activeSuffix).toBe("maj7");
  });
});
