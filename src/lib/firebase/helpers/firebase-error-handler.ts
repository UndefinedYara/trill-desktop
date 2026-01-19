import { FormState } from "@/types/ui/form-state";
import { FirebaseError } from "firebase/app";
import { AuthErrorCodes } from "firebase/auth";

export function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError;
}

export function handleFirebaseError(code: string): FormState {
  switch (code) {
    case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
      return {
        type: "error",
        errors: { form: { errors: ["Incorrect Email or Password"] } },
      };

    case AuthErrorCodes.EMAIL_EXISTS:
      return {
        type: "error",
        errors: { form: { errors: ["Email already in use"] } },
      };

    case AuthErrorCodes.WEAK_PASSWORD:
      return {
        type: "error",
        errors: { form: { errors: ["Password is too weak"] } },
      };

    default:
      return {
        type: "error",
        errors: { form: { errors: ["Something went wrong"] } },
      };
  }
}
