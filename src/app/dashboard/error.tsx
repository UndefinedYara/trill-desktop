"use client";

import { useEffect } from "react";

export default function Error(error: Error) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-2xl  text-primary">Failed to load chord data</h1>
      <p className="mt-2 text-sm">
        Please check your internet connection and try again.
      </p>
    </div>
  );
}
