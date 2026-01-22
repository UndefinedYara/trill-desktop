"use client";

interface StatsChipProps {
  title: string;
  dataPoint?: string;
}
export function StatsChip({ title, dataPoint }: StatsChipProps) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <p className="text-xs md:text-md font-light text-white/70">{title}</p>
      <p className="text-md md:text-xl font-medium">{dataPoint}</p>
    </div>
  );
}
