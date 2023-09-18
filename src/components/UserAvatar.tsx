import { User } from "next-auth";
import Image from "next/image";
import { Icons } from "./Icons";

interface UserAvatarProps {
  className?: string;
  user: Pick<User, "image">;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, className }) => {
  return (
    <>
      {user?.image ? (
        <Image
          alt="User Avatar"
          src={user.image}
          className={`rounded-full${className ? " " + className : ""}`}
          referrerPolicy="no-referrer"
          width={30}
          height={30}
        />
      ) : (
        <Icons.user
          className={`h-full w-full rounded-full${
            className ? " " + className : ""
          }`}
        />
      )}
    </>
  );
};

export default UserAvatar;
