import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row justify-center md:justify-between items-center h-full md:px-10">
      <div className="flex flex-col gap-2 w-full">
        <p className="text-center md:text-left font-manrope font-medium text-primary uppercase">
          Chord Master
        </p>
        <h1 className="text-center md:text-left text-5xl md:text-8xl font-manrope font-semibold tracking-wide">
          Hyper-simple!
        </h1>
        <p className=" text-center md:text-left  md:text-xl font-manrope font-extralight tracking-wide mt-2">
          Looking for a guitar chord?
          <span className="font-bold text-primary mr-1">
            <br />
            Trill
          </span>
          helps you quickly identify the chords you&apos;re playing!
        </p>
        <div className="hidden md:flex  gap-2 mt-8 items-center justify-center md:justify-start  ">
          <Link href="../dashboard">
            <Button
              arrow={"right"}
              className="hover:cursor-pointer px-6 py-3 bg-primary rounded-lg  border-solid  text-lg  not-italic font-semibold leading-[18px]"
            >
              Get started
            </Button>
          </Link>
          <p className="ml-5">
            Or
            <Link href="./signup" className="text-primary ml-2">
              Create an Account.
            </Link>
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/3 h-[250px] md:h-auto relative">
        <Image
          src={"/images/eq.gif"}
          alt="white"
          width={1000}
          height={1000}
          className="max-w-full"
          priority
        />
      </div>
      <div className="flex flex-col md:hidden gap-5 mt-8 items-center justify-center md:justify-start ">
        <Link href="../dashboard">
          <Button
            arrow={"right"}
            className="hover:cursor-pointer px-8 py-4 bg-primary rounded-lg  border-solid  text-xl not-italic font-semibold leading-[18px]"
          >
            Get started
          </Button>
        </Link>
        <p>
          Don&apos;t have an account?
          <Link href="./signup" className="text-primary ml-2">
            Create one now.
          </Link>
        </p>
      </div>
    </main>
  );
}
