import { SessionUser } from "@/lib/auth/get-session";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { StatsChip } from "./stats-chip";
import { LogOutButton } from "./session/logout";
import { Chip } from "./chip";

export function MeCard({ user }: { user: SessionUser }) {
  return (
    <div className="relative flex flex-col md:flex-row gap-2 md:gap-0  items-center justify-between ">
      <div className="flex flex-col mb-10 items-center gap-5">
        <div className="w-20 md:w-30 border rounded-full">
          <Image
            src={user.picture || "/images/eq.png"}
            alt="avatar"
            className="max-w-full"
            width={700}
            height={700}
          ></Image>
        </div>
        <div>
          <p className="text-xl md:text-2xl font-medium">
            {user.name || user.email?.split("@").shift()}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center mb-8 md:mb-0">
        <div className="flex gap-6 md:gap-10  mb-8 ">
          <StatsChip
            title="Member Since"
            dataPoint={user.memberSince?.toLocaleDateString()}
          />
          <StatsChip title="Favorite Chords" dataPoint="0" />
          <StatsChip title="Practice Rating" dataPoint="5/5" />
        </div>
        <div className="flex gap-2 md:gap-3 mb-16 ">
          <Chip title="Saved Chords" />
          <Chip title="Practice Routine" />
          <Chip title="Song Suggestion" />
        </div>
      </div>
      <div className="absolute bottom-4 right-3 md:bottom-0 md:right-0">
        <LogOutButton />
      </div>
    </div>
  );
}
