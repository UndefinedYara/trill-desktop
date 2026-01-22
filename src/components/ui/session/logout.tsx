"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase-client-config";
import { useState } from "react";

export function LogOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function handleLogout() {
    setIsLoading(true);
    await signOut(auth);
    try {
      const response = await fetch("/api/session/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        router.replace("/");
      } else {
        console.error("Failed to clear session cookie:", await response.json());
      }
    } catch (e) {
      console.error("Failed to clear session cookie:", e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      loading={isLoading}
      disabled={isLoading}
      onClick={handleLogout}
      className="px-5 py-2 text-sm"
    >
      Log out
    </Button>
  );
}
