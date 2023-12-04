"use client";

import UserAuthForm from "../navmenu/UserAuthForm";
import { Button } from "../ui/button";
import Dialog, { useDialogStore } from "../ui/dialog";

const SignInOrUp = () => {
  const { dialogToShow, setDialogToShow } = useDialogStore();

  return (
    <>
      <Button className="shrink-0" onClick={() => setDialogToShow("sign-in")}>
        Sign In
      </Button>
      {dialogToShow === "sign-in" && (
        <Dialog onCloseAction={() => setDialogToShow(null)}>
          <div className="space-y-6 py-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-zinc-800 md:text-4xl">
                Welcome Back!
              </h1>
              <p className="text-sm text-zinc-700">
                Glad to get you back. You missed a lot since you were gone!
              </p>
            </div>
            <UserAuthForm mode="SingIn" />
            <p className="text-sm text-muted-foreground">
              New to FindIt?{" "}
              <button
                onClick={() => setDialogToShow("sign-up")}
                className="underline underline-offset-4"
              >
                Sing Up
              </button>
            </p>
          </div>
        </Dialog>
      )}
      {dialogToShow === "sign-up" && (
        <Dialog onCloseAction={() => setDialogToShow(null)}>
          <div className="space-y-6 py-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">
                Join FindIt
              </h1>
              <p className="text-sm text-slate-700">
                By continuing, you are setting up a FindIt account and agree to
                our privacy policy.
              </p>
            </div>
            <UserAuthForm mode="SingUp" />
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => setDialogToShow("sign-in")}
                className="underline underline-offset-4"
              >
                Sing In
              </button>
            </p>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default SignInOrUp;
