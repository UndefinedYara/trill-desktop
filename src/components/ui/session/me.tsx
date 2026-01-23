import { getSession } from "@/lib/auth/get-session";
import { UserCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../dialog";
import { MeCard } from "../me-card";
import Link from "next/link";
export async function Me() {
  const user = await getSession();
  return user ? (
    <div className="flex items-center ">
      <Dialog>
        <DialogTrigger>
          <UserCircle
            width={30}
            className="text-white mr-2 hover:cursor-pointer"
          />
        </DialogTrigger>
        <DialogContent className="rounded-2xl  bg-black/50  w-5/6 md:w-full md:max-w-3xl py-3 md:py-10 md:px-8">
          <DialogTitle />
          <MeCard user={user} />
        </DialogContent>
      </Dialog>
    </div>
  ) : (
    <div className="flex items-center text-sm">
      <p>
        You are signed out.
        <Link href="/login" className="text-primary ml-1">
          Sign in?
        </Link>
      </p>
    </div>
  );
}
