"use client";

import Link from "next/link";
import UserAuthForm from "../navmenu/UserAuthForm";
import { Button } from "../ui/button";
import Dialog, { useDialogStore } from "../ui/dialog";

const SignIn = () => {
  const { dialogToShow, setDialogToShow } = useDialogStore();

  return (
    <>
      <Button onClick={() => setDialogToShow("sign-in")}>Sign In</Button>
      {dialogToShow === "sign-in" && (
        <Dialog onCloseAction={() => setDialogToShow(null)}>
          <div className="space-y-6 py-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-zinc-800 md:text-4xl">
                Welcome Back!
              </h1>
              <p className="text-sm text-zinc-700">
                By continuing, you are setting up a FindIt account and agree to
                our privacy policy.
              </p>
            </div>
            <UserAuthForm />
            <p className="text-sm text-muted-foreground">
              New to FindIt?{" "}
              <Link href="/sign-up" className="underline underline-offset-4">
                Sing Up
              </Link>
            </p>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default SignIn;
