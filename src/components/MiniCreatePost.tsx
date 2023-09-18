"use client";

import { User } from "next-auth";
import UserAvatar from "./UserAvatar";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ImageIcon, Link2 } from "lucide-react";

interface MiniCreatePostProps {
  user: Pick<User, "image">;
}

const MiniCreatePost: React.FC<MiniCreatePostProps> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="w-full rounded-md bg-white shadow">
      <div className="relative flex items-center gap-4 px-8 py-6">
        <div className="relative h-8 w-8 shrink-0 rounded-full">
          <UserAvatar user={user} />
          <span className="absolute bottom-0 right-0 aspect-square w-3 rounded-full bg-green-500"></span>
        </div>
        <input
          readOnly
          onClick={() => router.push(pathname + "/submit")}
          placeholder="Create Post"
          className="grow rounded border px-4 py-2"
        />
        <Button
          size="sm"
          className="absolute right-20 top-1/2 -translate-y-1/2"
          variant="ghost"
          onClick={() => router.push(pathname + "/submit")}
        >
          <ImageIcon className="text-slate-600" />
        </Button>
        <Button
          size="sm"
          className="absolute right-10 top-1/2 -translate-y-1/2"
          variant="ghost"
          onClick={() => router.push(pathname + "/submit")}
        >
          <Link2 className="text-slate-600" />
        </Button>
      </div>
    </div>
  );
};

export default MiniCreatePost;
