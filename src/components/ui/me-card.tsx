import { SessionUser } from "@/lib/auth/get-session";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { StatsChip } from "./stats-chip";
import { LogOutButton } from "./session/logout";
import { Chip } from "./chip";

export function MeCard({ user }: { user: SessionUser }) {
  return (
    <div className="flex relative items-center justify-between px-2 py-5  ">
      <div className="flex flex-col mb-10 items-center gap-5">
        <div className="w-30 border rounded-full">
          <Image
            src={user.picture || "/images/eq.png"}
            alt="avatar"
            className="max-w-full "
            width={800}
            height={800}
          ></Image>
        </div>
        <div>
          <p className="text-2xl font-medium">
            {user.name || user.email?.split("@").shift()}
          </p>
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-16">
          <StatsChip
            title="Member Since"
            dataPoint={user.memberSince?.toLocaleDateString()}
          />
          <StatsChip title="Favorite Chords" dataPoint="0" />
          <StatsChip title="Practice Rating" dataPoint="5/5" />
        </div>
        <div className="flex justify-between gap-5 mb-16">
          <Chip title="Saved Chords" />
          <Chip title="Practice Routine" />
          <Chip title="Song Suggestion" />
        </div>
      </div>
      <div className="absolute -bottom-3 right-0">
        <LogOutButton />
      </div>
    </div>
  );
}
