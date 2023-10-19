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
import { SkeletonText } from "../Skeleton";

interface PostProps {
  post: ExtendedPost;
}

function Post({ post }: PostProps, ref?: ForwardedRef<HTMLLIElement | null>) {
  const pathname = usePathname();

  return (
    <li {...(ref ? { ref } : {})} className="rounded-md bg-white p-4 shadow">
      <PostMetadata
        createdAt={post.createdAt}
        topicName={pathname.startsWith(`/t/`) ? undefined : post.topicName}
        username={post.author.username!}
        userId={post.author.id}
      />
      <article className="prose prose-slate relative max-h-96 overflow-hidden">
        <Link
          href={`/t/${post.topicName}/post/${post.id}`}
          className="no-underline"
        >
          <h2>{post.title}</h2>
        </Link>
        <EditorOutput data={post.content} />
        <div className="absolute bottom-0 left-0 top-80 w-full bg-gradient-to-b from-transparent to-white" />
      </article>
      <div className="mt-3 flex items-center gap-4 text-sm">
        <PostVoteClient
          postId={post.id}
          initialUserVote={post.userVote}
          initialRating={post.rating}
          mutationUrl="/api/post-vote"
        />
        <Link
          href={`/t/${post.topicName}/post/${post.id}#comments`}
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

export default forwardRef<HTMLLIElement | null, PostProps>(Post);
