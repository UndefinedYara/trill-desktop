import { LoginForm } from "@/components/ui/forms";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen  gap-10 ">
      <div className="w-5/6 md:w-2/6 bg-neutral-900/40 rounded-lg p-8 flex flex-col gap-6 ">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            <span className="text-primary">Hi!</span> Welcome back.
          </h1>
          <p className="text-sm font-extralight mt-1">
            Log in to access your personal practice history.
          </p>
        </div>

        <LoginForm />
        <Link href="/signup" className="flex w-full justify-center gap-2">
          Don&apos;t have an account?
          <span className="text-primary"> Sign up.</span>
        </Link>
      </div>
    </main>
  );
}
