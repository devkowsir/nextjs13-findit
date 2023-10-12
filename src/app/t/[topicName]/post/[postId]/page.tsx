import CommentForm from "@/components/comment/CommentForm";
import CommentsWrapper from "@/components/comment/CommentsWrapper";
import PostActions from "@/components/post/PostActions";
import EditorOutput from "@/components/editor/EditorOutput";
import BackButton from "@/components/feed/BackButton";
import PostMetadata from "@/components/post/PostMetadata";
import { buttonVariants } from "@/components/ui/button";
import PostVoteClient from "@/components/vote/PostVoteClient";
import { numberFormatter } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { getPost } from "@/lib/database/utils";
import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface pageProps {
  params: { postId: string; topicName: string };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page: React.FC<pageProps> = async ({ params: { postId, topicName } }) => {
  const post = await getPost(postId);
  const session = await getAuthSession();

  if (!post) return notFound();

  return (
    <>
      <BackButton />
      <div className="mt-4 flex gap-2 md:gap-4">
        <div className="flex w-full flex-col gap-4 rounded-md bg-white p-4">
          <PostMetadata
            createdAt={post.createdAt}
            username={post.author.username!}
            topicName={post.topicName}
            userId={post.author.id}
          />
          <div className="prose text-[0.8rem] text-slate-700">
            <h1>{post.title}</h1>
            <EditorOutput data={post.content} />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-4 text-sm">
              <PostVoteClient
                postId={post.id}
                mutationUrl={`/api/post-vote`}
                initialUserVote={post.userVote}
                initialVotesAmount={post.rating}
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
            </div>
            {post.author.id === session?.user.id && (
              <PostActions postId={postId} />
            )}
          </div>

          <div id="comments" className="flex flex-col gap-2">
            <p className="text-lg">Your Comment</p>
            <CommentForm postId={postId} />
          </div>
          <CommentsWrapper postId={postId} />
        </div>
      </div>
    </>
  );
};

export default page;
