import useOnClickOutside from "@/hooks/useOnClickOutside";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Dispatch, SetStateAction, useRef } from "react";
import Settings from "../dialogs/Settings";

interface UserNavMenuProps {
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
    email?: string | null;
    username?: string | null;
  };
  setShowUserMenu: Dispatch<SetStateAction<boolean>>;
}

const UserNavMenu: React.FC<UserNavMenuProps> = ({ user, setShowUserMenu }) => {
  const userNavMenuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => {
    setShowUserMenu(false);
  }, userNavMenuRef);

  return (
    <>
      <div
        ref={userNavMenuRef}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-full z-10 w-64 divide-y rounded-lg bg-white py-2 shadow [&>*]:px-1  [&>*]:py-1"
      >
        <div className="mb-2 [&>*]:px-4">
          <p className="text-lg">{user.name}</p>
          <p className="text-sm text-slate-600">{user.email}</p>
        </div>
        <ul className="[&>*:hover]:bg-slate-900/5 [&>*]:cursor-pointer [&>*]:rounded [&>*]:px-4 [&>*]:py-1 [&>*]:transition [&>li>*]:inline-block [&>li>*]:w-full">
          <li>
            <Link href="/" onClick={() => setShowUserMenu(false)}>
              My Feed
            </Link>
          </li>
          <li>
            <Link href="/t/create" onClick={() => setShowUserMenu(false)}>
              Create Topic
            </Link>
          </li>
          <li>
            <Settings userId={user.id} />
          </li>
        </ul>
        <div className="[&>*:hover]:bg-slate-900/5 [&>*]:cursor-pointer [&>*]:rounded [&>*]:px-4 [&>*]:py-1 [&>*]:transition">
          <div onClick={() => signOut()}>Sign Out</div>
        </div>
      </div>
    </>
  );
};

export default UserNavMenu;
