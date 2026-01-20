"use server";

import { auth } from "@/lib/firebase/firebase-client-config";
import {
  handleFirebaseError,
  isFirebaseError,
} from "@/lib/firebase/helpers/firebase-error-handler";
import { FormState } from "@/types/ui/form-state";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { z } from "zod";
import { redirect } from "next/navigation";

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
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const userFirebaseToken = await response.user.getIdToken();
    return {
      type: "success",
      idToken: userFirebaseToken,
      message: "Account created successfully!",
    };
  } catch (error: any) {
    if (isFirebaseError(error)) {
      return handleFirebaseError(error.code);
    } else {
      return { type: "error", errors: error.message };
    }
  }
}

const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

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
    const response = await signInWithEmailAndPassword(auth, email, password);
    const userFirebaseToken = await response.user.getIdToken();
    return {
      type: "success",
      idToken: userFirebaseToken,
      message: "Account created successfully!",
    };
  } catch (error: any) {
    if (isFirebaseError(error)) {
      return handleFirebaseError(error.code);
    } else {
      return { type: "error", errors: error.message };
    }
  }
}
