import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import Logo from "./Logo";
import UserAccountNav from "./UserAccountNav";
import { buttonVariants } from "./ui/button";
import SearchTopic from "./SearchTopic";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <nav className="fixed left-0 right-0 top-0 z-10 h-fit border-slate-200 bg-transparent py-3 shadow backdrop-blur-md">
      <div className="container flex w-screen items-center justify-between gap-4">
        <Link className="shrink-0" href="/">
          <Logo />
        </Link>
        <SearchTopic />
        {session && session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link className={`${buttonVariants()} mr-2 shrink-0`} href="/sign-in">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
