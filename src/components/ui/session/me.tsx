import { getSession } from "@/lib/auth/get-session";
import { UserCircle } from "lucide-react";
import { Button } from "../button";
import { Dialog, DialogContent, DialogTrigger } from "../dialog";
import { MeCard } from "../me-card";
import { DialogTitle } from "@radix-ui/react-dialog";
import Link from "next/link";
export async function Me() {
  const user = await getSession();
  return user ? (
    <div className="flex items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="px-0 bg-transparent">
            <UserCircle width={20} className="text-white mr-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl rounded-xl border-primary/70 bg-black/50">
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
