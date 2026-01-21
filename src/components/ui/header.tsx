import Image from "next/image";
import Link from "next/link";
import { Me } from "./session/me";

export function Header() {
  return (
    <header className="fixed top-10 flex justify-center w-full z-1">
      <div className="flex bg-white/3 backdrop-blur-2xl w-5/6 md:w-3/5 rounded-2xl justify-between  px-4 md:px-5 md:py-3">
        <Link href="/">
          <div className="flex items-center justify-center ">
            <div className="w-14">
              <Image
                src={"/images/eq.png"}
                alt="white"
                width={1000}
                height={1000}
              />
            </div>
            <h1 className="font-manrope text-2xl font-light text-white">
              trill
            </h1>
          </div>
        </Link>
        <Me />
      </div>
    </header>
  );
}
