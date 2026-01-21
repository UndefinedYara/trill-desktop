"use client";

interface ChipProps {
  title: string;
  onClick?: () => void;
}
export function Chip({ title, onClick = () => {} }: ChipProps) {
  return (
    <div
      className="flex flex-col gap-2 items-center rounded-full bg-neutral-700 px-3 py-1 hover:cursor-pointer hover:bg-neutral-600 duration-100"
      onClick={onClick}
    >
      <p className="text-sm font-light text-white/90">{title}</p>
    </div>
  );
}
