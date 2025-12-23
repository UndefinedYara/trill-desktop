"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-row justify-between items-center h-full indent">
      <div className="flex flex-col gap-2">
        <p className="font-manrope font-medium text-primary uppercase">
          Chord Master
        </p>
        <h1 className="text-8xl font-manrope font-semibold tracking-wide">
          Hyper-simple!
        </h1>
        <p className="text-xl font-manrope font-extralight tracking-wide mt-2">
          Looking for a guitar chord? Making up a new one?
          <span className="font-bold text-primary mx-1">
            <br />
            trill
          </span>
          helps you quickly identify the chords you&apos;re playing!
        </p>
        <div className="flex gap-2 mt-8">
          <Link href="../dashboard">
            <Button
              arrow={"right"}
              className="hover:cursor-pointer px-6 py-3 bg-primary rounded-lg  border-solid  text-[14px] lg:text-lg  not-italic font-semibold leading-[18px]"
            >
              Try it
            </Button>
          </Link>
        </div>
      </div>
      <div className="w-1/3">
        <Image src={"/images/eq.gif"} alt="white" width={1000} height={1000} />
      </div>
    </main>
  );
}
