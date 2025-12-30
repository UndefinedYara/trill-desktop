export function Loading() {
  return (
    <div className="bg-black h-full w-full flex items-center justify-center gap-3">
      <div className="bg-white h-16 w-2.5 animate-bounce  mt-10"></div>
      <div className="bg-white h-10 w-2.5 "></div>
      <div className="bg-white h-12 w-2.5 animate-bounce mt-8"></div>
    </div>
  );
}
