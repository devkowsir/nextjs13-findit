"use client";

import EditorOutput from "@/components/editor/EditorOutput";
import PostVoteClient from "@/components/vote/PostVoteClient";
import { numberFormatter } from "@/config";
import { ExtendedPost } from "@/types/db";
import { MessagesSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardedRef, forwardRef } from "react";
import PostMetadata from "../post/PostMetadata";

interface MainFeedPostProps {
  post: ExtendedPost;
}

function Post(
  { post }: MainFeedPostProps,
  ref: ForwardedRef<HTMLLIElement | null>,
) {
  const pathname = usePathname();

  return (
    <li ref={ref} className="rounded-md bg-white shadow">
      <div className="relative flex grow flex-col gap-2 px-4 py-2">
        <PostMetadata
          createdAt={post.createdAt}
          topicName={pathname.startsWith(`/t/`) ? undefined : post.topicName}
          username={post.author.username!}
          userId={post.author.id}
        />
        <Link href={`/t/${post.topicName}/post/${post.id}`}>
          <h2 className="cursor-pointer text-xl font-semibold">
            {" "}
            {post.title}
          </h2>
        </Link>
        <EditorOutput data={post.content} />
      </div>
      <div className="flex items-center gap-4 px-4 py-2 text-sm">
        <PostVoteClient
          postId={post.id}
          initialUserVote={post.userVote}
          initialVotesAmount={post.rating}
          mutationUrl="/api/post-vote"
        />
        <Link
          href={`/t/${post.topicName}/post/${post.id}`}
          className="flex cursor-pointer items-center rounded-md bg-slate-50 hover:bg-accent"
        >
          <MessagesSquare
            className="rounded-md stroke-slate-700 p-1"
            size={32}
          />
          <span className="px-2">{`${numberFormatter.format(
            post.commentsCount,
          )}`}</span>
        </Link>
      </div>
    </li>
  );
}

export default forwardRef<HTMLLIElement | null, MainFeedPostProps>(Post);
