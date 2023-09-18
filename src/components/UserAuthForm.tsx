"use client";

import { useState } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

const UserAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithProvider = async (provider: string) => {
    setIsLoading(true);
    try {
      signIn(provider, { callbackUrl: "/" });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

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
};

export default UserAuthForm;
