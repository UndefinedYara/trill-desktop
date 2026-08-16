"use server";

import {
  handleFirebaseError,
  isFirebaseError,
} from "@/lib/firebase/helpers/firebase-error-handler";
import { FormState } from "@/types/ui/form-state";
import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession } from "./session";

const IDENTITY_TOOLKIT_URL = process.env.IDENTITY_TOOLKIT_URL;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_API_KEY!;

async function identityToolkitRequest(
  endpoint: "signUp" | "signInWithPassword",
  body: object,
): Promise<{ idToken: string }> {
  const res = await fetch(
    `${IDENTITY_TOOLKIT_URL}:${endpoint}?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, returnSecureToken: true }),
    },
  );

  if (!res.ok) {
    const err = await res.json();
    // Normalize to a Firebase-shaped error so our existing handler works
    const code = err?.error?.message ?? "UNKNOWN_ERROR";
    throw { code: `auth/${code.toLowerCase().replace(/_/g, "-")}` };
  }

  return res.json();
}

const signUpSchema = z
  .object({
    email: z.email({ error: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { error: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { error: "Contain at least one letter." })
      .regex(/[0-9]/, { error: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Contain at least one special character.",
      })
      .trim(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});


export async function signup(
  prevState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = signUpSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      type: "error",
      errors: z.treeifyError(validatedFields.error).properties,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const { idToken } = await identityToolkitRequest("signUp", { email, password });
    await createSession(idToken);
  } catch (error: any) {
    if (isFirebaseError(error)) {
      return handleFirebaseError(error.code);
    }
    return { type: "error", errors: error.message };
  }

  redirect("/dashboard");
}

export async function login(
  prevState: FormState | null,
  formData: FormData,
): Promise<FormState> {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      type: "error",
      errors: z.treeifyError(validatedFields.error).properties,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const { idToken } = await identityToolkitRequest("signInWithPassword", { email, password });
    await createSession(idToken);
  } catch (error: any) {
    if (isFirebaseError(error)) {
      return handleFirebaseError(error.code);
    }
    return { type: "error", errors: error.message };
  }

  redirect("/dashboard");
}
