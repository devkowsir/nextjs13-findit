"use client";

import { numberFormatter } from "@/config";
import { cn } from "@/lib/utils";
import { ExtendedComment } from "@/types/db";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import CommentsProvider from "../comment/CommentStore";
import EditorOutput from "../editor/EditorOutput";
import { buttonVariants } from "../ui/button";
import PostVoteClient from "../vote/PostVoteClient";
import PostActions from "./PostActions";
import PostMetadata from "./PostMetadata";
import { usePost } from "./PostStore";

interface PostAndCommentsProps {
  userId: string | null;
  comments: ExtendedComment[];
}

const PostAndComments = ({ userId, comments }: PostAndCommentsProps) => {
  const { post, setPost } = usePost();

  return (
    <div className="flex w-full flex-col rounded-md bg-white p-4 pb-20">
      <PostMetadata
        createdAt={post.createdAt}
        username={post.author.username!}
        topicName={post.topicName}
        userId={post.author.id}
      />
      <article className="prose text-slate-700">
        <h1>{post.title}</h1>
        <EditorOutput data={post.content} />
      </article>
      <div className="mt-3 flex items-center justify-start gap-4 text-sm">
        <PostVoteClient
          postId={post.id}
          mutationUrl={`/api/post-vote`}
          initialUserVote={post.userVote}
          initialRating={post.rating}
          setPost={setPost}
        />
        <Link
          href={"#comments"}
          className={cn(
            buttonVariants({ variant: "secondary", size: "xs" }),
            "flex items-center gap-2 bg-slate-50",
          )}
        >
          <MessageSquare className="stroke-slate-700" size={24} />
          <span>{`${numberFormatter.format(post.commentsCount)}`}</span>
        </Link>
        {post.author.id === userId && <PostActions postId={post.id} />}
      </div>

      <CommentsProvider comments={comments} />
    </div>
  );
};

export default PostAndComments;
