import { z } from "zod";

export type FormState =
  | {
      type: "success";
      message: string;
      errors?: undefined;
    }
  | {
      type: "error";
      message?: string;
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
