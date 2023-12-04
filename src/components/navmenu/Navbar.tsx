import Logo from "@/components/Logo";
import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import SignInOrUp from "../dialogs/SignInOrUp";
import SearchTopicOrUser from "./SearchTopicOrUser";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <nav className="fixed left-0 right-0 top-0 z-10 h-fit border-slate-200 bg-transparent px-2 py-3 shadow backdrop-blur-md sm:px-4">
      <div className="container flex items-center justify-between gap-2 sm:gap-4 lg:max-w-5xl">
        <Link className="shrink-0" href="/">
          <Logo />
        </Link>
        <SearchTopicOrUser />
        {session && session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <SignInOrUp />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
