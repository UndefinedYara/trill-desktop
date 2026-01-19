"use client";

import { Eye, EyeClosed, EyeOff } from "lucide-react";
import { HTMLInputTypeAttribute, useState } from "react";

interface InputProps {
  fieldName: string;
  label: string;
  type: HTMLInputTypeAttribute;
  errors?: string[];
}

export function Input({ fieldName, label, type, errors }: InputProps) {
  const [value, setValue] = useState<string>("");
  const [peek, setPeek] = useState<boolean>(false);
  const firstError = errors?.[0];

  const isPassword = type === "password";
  const inputType = isPassword && !peek ? "password" : "text";

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          id={fieldName}
          name={fieldName}
          type={inputType}
          placeholder={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={!!errors}
          aria-describedby={errors ? `${fieldName}-error` : undefined}
          className="text-white px-2 py-2 pr-10 border-b border-border w-full
                     focus:outline-none focus:border-white bg-transparent
                     placeholder:text-neutral-500"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setPeek((prev) => !prev)}
            aria-label={peek ? "Hide password" : "Show password"}
            className="absolute right-0 top-1/2 -translate-y-1/2 
                       text-neutral-400 hover:text-white
                       focus:outline-none"
          >
            {peek ? <Eye width={15} /> : <EyeOff width={15} />}
          </button>
        )}
      </div>

      {firstError && (
        <p id={`${fieldName}-error`} className="text-sm text-red-500">
          {firstError}
        </p>
      )}
    </div>
  );
}
