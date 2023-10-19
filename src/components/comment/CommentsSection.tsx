"use client";

import { ExtendedComment } from "@/types/db";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Sort from "../Sort";
import { usePost } from "../post/PostStore";
import Comment from "./Comment";
import { useComment } from "./CommentStore";

const CommentsSection = () => {
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState("");
  const { comments, sortMode, setSortMode, setComments } = useComment();
  const { post } = usePost();

  const { isLoading } = useQuery({
    queryKey: ["comments", post.id, sortMode],
    queryFn: async () => {
      const { data } = (await axios.get(
        `/api/comments?postId=${post.id}&sort-mode=${sortMode}`,
      )) as {
        data: ExtendedComment[];
      };
      setComments(data);
      return data;
    },
    initialData: () => (sortMode === "top" ? comments : undefined),
    staleTime: Infinity,
    initialDataUpdatedAt: Infinity,
  });

  useEffect(() => {
    setComments(
      queryClient.getQueryData(["comments", post.id, sortMode]) || [],
    );
  }, [sortMode]);

  if (isLoading)
    return (
      <div className="py-8">
        <Loader2 size={24} className="mx-auto animate-spin" />
      </div>
    );

  return (
    <div>
      <div className="my-4 flex items-center justify-between">
        <h3 className="text-xl font-semibold">Comments</h3>
        <Sort sortMode={sortMode} setSortMode={setSortMode} />
      </div>
      {comments.length > 0 ? (
        <div>
          <ul className="space-y-6">
            {comments
              .filter((comment) => comment.replyToId === null)
              .map((comment) => (
                <li key={comment.id}>
                  <Comment
                    postId={post.id}
                    comment={comment}
                    replyDepth={0}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                  />
                </li>
              ))}
          </ul>
        </div>
      ) : post.commentsCount > 0 ? (
        <p>{`No ${sortMode} comments found.`}</p>
      ) : (
        <p>No one commented for this post yet.</p>
      )}
    </div>
  );
};

export default CommentsSection;
