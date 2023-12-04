"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

type Mode = "SingIn" | "SingUp";

const UserAuthForm = ({ mode }: { mode: Mode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithProvider = async (provider: string) => {
    setIsLoading(true);
    try {
      signIn(provider, {});
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const singUpWithProvider = async (provider: string) => {};

  if (mode === "SingIn")
    return (
      <div className="space-y-4">
        <Button
          onClick={() => signInWithProvider("github")}
          className="flex w-full items-center gap-2"
          disabled={isLoading}
        >
          <Icons.github className="w-4 fill-zinc-100" />
          Github
        </Button>
        <Button
          onClick={() => signInWithProvider("google")}
          className="flex w-full items-center gap-2"
          disabled={isLoading}
        >
          <Icons.google className="w-4 fill-zinc-100" />
          Google
        </Button>
      </div>
    );
  return <></>;
};

export default UserAuthForm;
