import { formatTimeToNow } from "@/lib/utils";
import Link from "next/link";

interface PostMetadataProps {
  pathname?: string;
  topicName: string;
  username: string;
  createdAt: Date;
}

const PostMetadata: React.FC<PostMetadataProps> = ({
  topicName,
  username,
  pathname,
  createdAt,
}) => {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-700">
      {pathname?.endsWith(`/t/${topicName}`) ? null : (
        <>
          <Link
            className="underline underline-offset-2"
            href={`/t/${topicName}`}
          >
            t/{topicName}
          </Link>
          <span className="inline-block h-1 w-1 rounded-full bg-slate-950" />
        </>
      )}
      <span>
        <span className="hidden min-[400px]:inline">Posted </span>by u/
        {username}
      </span>
      <span className="inline-block h-1 w-1 rounded-full bg-slate-950" />
      <span>{formatTimeToNow(new Date(createdAt))}</span>
    </div>
  );
};

export default PostMetadata;
