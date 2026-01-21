import { SignUpForm } from "@/components/ui/forms";
import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen  gap-10 ">
      <div className="w-5/6 md:w-2/6 bg-neutral-900/40 rounded-lg py-10 px-8 flex flex-col gap-6 ">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            <span className="text-primary">Start</span> practicing smarter.
          </h1>
          <p className="text-sm mt-1 ">Access user-only exclusive features.</p>
        </div>

        <SignUpForm />
        <Link href="/login" className="flex w-full justify-center gap-2">
          Already have an account? <span className="text-primary">Log in.</span>
        </Link>
      </div>
    </main>
  );
}
