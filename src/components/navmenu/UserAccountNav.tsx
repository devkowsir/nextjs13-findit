"use client";

import UserAvatar from "@/components/UserAvatar";
import { useState } from "react";
import UserNavMenu from "./UserNavMenu";
import { User } from "next-auth";

interface UserAccountNavProps {
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
    email?: string | null;
    username?: string | null;
  };
}

const UserAccountNav: React.FC<UserAccountNavProps> = ({ user, ...props }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div
      {...props}
      className="relative mr-2 h-8 w-8 shrink-0 rounded-full border border-slate-300 sm:mr-0"
      onClick={() => setShowUserMenu((prev) => !prev)}
    >
      <UserAvatar user={user} className="cursor-pointer" />
      {showUserMenu ? (
        <UserNavMenu user={user} setShowUserMenu={setShowUserMenu} />
      ) : null}
    </div>
  );
};

export default UserAccountNav;
