"use client";

import { Eye, EyeOff } from "lucide-react";
import { HTMLInputTypeAttribute, useState } from "react";
import { ErrorMessage } from "./errormessage"; // Assuming you have this

// Make props more flexible
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  fieldName: string;
  label?: string;
  errors?: string[];
}

export function Input({
  fieldName,
  label,
  type,
  errors,
  ...props // Pass through any other input props
}: InputProps) {
  const [peek, setPeek] = useState(false);

  const isPassword = type === "password";
  // If the type is password, allow it to be toggled. Otherwise, use the provided type.
  const inputType = isPassword ? (peek ? "text" : "password") : type;

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={fieldName} className="text-sm text-neutral-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={fieldName}
          name={fieldName}
          type={inputType}
          className="text-white px-2 py-2 pr-10 border-b border-border w-full
                     focus:outline-none focus:border-white bg-transparent
                     placeholder:text-neutral-500"
          {...props} // Spread the rest of the props
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setPeek((prev) => !prev)}
            aria-label={peek ? "Hide password" : "Show password"}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white focus:outline-none"
          >
            {peek ? <Eye width={15} /> : <EyeOff width={15} />}
          </button>
        )}
      </div>
      {errors && <ErrorMessage message={errors[0]} />}
    </div>
  );
}
