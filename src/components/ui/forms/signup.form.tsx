"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { signup } from "@/app/actions/auth";
import { FormState } from "@/types/ui/form-state";
import { ErrorMessage } from "../errormessage";
import { Input } from "../input";

const initialState: FormState = {
  type: "",
};

export function SignUpForm() {
  const [state, action, pending] = useActionState(signup, initialState);
  const fieldErrors = state.type === "error" ? state.errors : {};
  return (
    <form action={action} className="space-y-6 w-full">
      {/* email input */}
      <Input
        fieldName="email"
        placeholder="Email"
        type="text"
        errors={fieldErrors?.email?.errors}
      />

      {/* password input */}
      <Input
        fieldName="password"
        placeholder="Password"
        type="password"
        errors={fieldErrors?.password?.errors}
      />

      <Input
        fieldName="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        errors={fieldErrors?.confirmPassword?.errors}
      />

      <div className="flex flex-col gap-5 text-center w-full justify-center py-5">
        <Button
          type="submit"
          disabled={pending}
          className="px-8 py-2"
        >
          Sign up
        </Button>
        {state.type === "error" && (
          <ErrorMessage message={fieldErrors?.form?.errors[0]} />
        )}
      </div>
    </form>
  );
}
