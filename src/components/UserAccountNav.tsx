"use client";

import { User } from "next-auth";
import Image from "next/image";
import { useState } from "react";
import { Icons } from "./Icons";
import UserNavMenu from "./UserNavMenu";
import UserAvatar from "./UserAvatar";

interface UserAccountNavProps {
  user: Pick<User, "name" | "image" | "email">;
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
