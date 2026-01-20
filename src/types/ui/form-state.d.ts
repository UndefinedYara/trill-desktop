import { z } from "zod";

export type FormState =
  | {
      type: "success";
      idToken: string | undefined;
      message: string;
      errors?: undefined;
    }
  | {
      type: "error";
      errors:
        | {
            email?: { errors: string[] } | undefined;
            password?: { errors: string[] } | undefined;
            confirmPassword?: { errors: string[] } | undefined;
            form?: { errors: string[] } | undefined;
          }
        | undefined;
    }
  | {
      type: "";
      message?: undefined;
      errors?: undefined;
    };
