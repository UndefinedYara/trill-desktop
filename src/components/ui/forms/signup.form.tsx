"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signup } from "@/app/actions/auth";
import { FormState } from "@/types/ui/form-state";
import { Input } from "../input";
import { useRouter } from "next/navigation";

const initialState: FormState = {
  type: "",
};

export function SignUpForm() {
  const [state, action, pending] = useActionState(signup, initialState);
  const fieldErrors = state.type === "error" ? state.errors : {};
  const router = useRouter();

  useEffect(() => {
    async function setCookie() {
      if (state.type === "success" && state.idToken) {
        try {
          const response = await fetch("/api/session/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: state.idToken }),
          });

          if (response.ok) {
            router.replace("/dashboard");
          } else {
            console.error(
              "Failed to set session cookie:",
              await response.json(),
            );
          }
        } catch (e) {
          console.error("Failed to set session cookie:", e);
        }
      }
    }

    setCookie();
  }, [state]);
  return (
    <form action={action} className="space-y-6 w-full">
      {/* email input */}
      <Input
        fieldName="email"
        label="Email"
        type="text"
        errors={fieldErrors?.email?.errors}
      />

      {/* password input */}
      <Input
        fieldName="password"
        label="Password"
        type="password"
        errors={fieldErrors?.password?.errors}
      />

      <Input
        fieldName="confirmPassword"
        label="Confirm Password"
        type="password"
        errors={fieldErrors?.confirmPassword?.errors}
      />
      <div className="flex flex-col gap-5 text-center w-full justify-center py-5">
        <Button
          type="submit"
          disabled={pending}
          loading={pending}
          className="px-8 py-2"
        >
          Sign up
        </Button>
        {state.type === "error" && (
          <p className="text-red-500">{fieldErrors?.form?.errors}</p>
        )}
      </div>
    </form>
  );
}
