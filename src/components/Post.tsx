"use client";

import { ExtendedPost } from "@/types/db";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import EditorOutput from "./EditorOutput";
import PostMetadata from "./PostMetadata";
import VoteClient from "./vote/VoteClient";

interface PostProps {
  post: ExtendedPost;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const pRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  return (
    <>
      <div className="flex gap-2 px-4 py-2 md:gap-4 md:px-6 md:py-4">
        <VoteClient
          id={post.id}
          initialUserVote={post.userVote}
          initialVoteAmount={post.votesAmount}
          mutationUrl="/api/post-vote"
          className="flex-col"
        />

        <div
          ref={pRef}
          className="relative flex max-h-40 grow flex-col gap-2 overflow-clip"
        >
          {pRef.current?.clientHeight === 160 ? (
            <div className="absolute bottom-0 left-0 z-[1] h-1/2 w-full bg-gradient-to-b from-transparent to-white" />
          ) : null}
          <PostMetadata
            createdAt={post.createdAt}
            topicName={post.topic.name}
            username={post.author.username}
            pathname={pathname}
          />
          <Link href={`/t/${post.topic.name}/post/${post.id}`}>
            <h2 className="cursor-pointer text-xl font-semibold">
              {post.title}
            </h2>
          </Link>
          <EditorOutput data={post.content} />
        </div>
      </div>
      <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 text-sm md:px-6 md:py-4">
        <MessageSquare className="" size={20} />
        {`${post.commentsCount} comments`}
      </div>
    </>
  );
};

export default Post;
