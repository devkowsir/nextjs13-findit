import UserAuthForm from "@/components/UserAuthForm";
import Link from "next/link";

const SignIn = () => {
  return (
    <main className="container max-w-sm space-y-6 py-12 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-zinc-800 md:text-4xl">
          Welcome Back!
        </h1>
        <p className="text-sm text-zinc-700">
          By continuing, you are setting up a FindIt account and agree to our
          privacy policy.
        </p>
      </div>
      <UserAuthForm />
      <p className="text-sm text-muted-foreground">
        New to FindIt?{" "}
        <Link href="/sign-up" className="underline underline-offset-4">
          Sing Up
        </Link>
      </p>
    </main>
  );
};

export default SignIn;
