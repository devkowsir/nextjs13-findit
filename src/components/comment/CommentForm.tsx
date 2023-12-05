"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/useToast";
import { setInfinitePostsCache } from "@/lib/queryCacheUpdaters/infinitePostCacheUpdate";
import { CommentCreationPayload } from "@/lib/validators/comment";
import { ExtendedComment } from "@/types/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { usePost } from "../post/PostStore";
import { useComment } from "./CommentStore";

interface CommentFormProps {
  postId: string;
  replyToName?: string;
  replyToId?: string;
  setReplyingTo?: Dispatch<SetStateAction<string>>;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  replyToName,
  replyToId,
  setReplyingTo,
}) => {
  const queryClient = useQueryClient();
  const { addComment } = useComment();
  const { setPost } = usePost();
  const [comment, setComment] = useState<string>(
    replyToName ? `@${replyToName} ` : "",
  );

  const { mutate: postComment, isLoading } = useMutation({
    async mutationFn({ comment }: { comment: string }) {
      const payload: CommentCreationPayload = {
        postId,
        text: comment,
      };

      if (replyToId) payload.replyToId = replyToId;

      const { data } = await axios.post("/api/comment", payload);
      return data as Pick<
        ExtendedComment,
        "id" | "author" | "createdAt" | "text" | "replyToId"
      >;
    },
    onError() {
      return toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    },
    onSuccess(comment) {
      addComment({ ...comment, userVote: null, rating: 0, repliesCount: 0 });
      setInfinitePostsCache(
        postId,
        (old) => ({ ...old, commentsCount: old.commentsCount + 1 }),
        queryClient,
      );
      comment.replyToId === null &&
        setPost((prev) => ({ ...prev, commentsCount: prev.commentsCount + 1 }));
      setComment("");
      setReplyingTo && setReplyingTo("");
      return toast({
        title: "Your comment has been successfully published.",
      });
    },
  });

  return (
    <div>
      <textarea
        className="mb-2 w-full rounded-md border p-2 text-sm placeholder:text-slate-400"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="What are your thoughts?"
        onFocus={(e) => {
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length,
          );
        }}
        {...(replyToId ? { autoFocus: true } : {})}
      />
      <div className="flex justify-end gap-4">
        {setReplyingTo && setReplyingTo ? (
          <Button
            size="sm"
            onClick={() => setReplyingTo("")}
            variant="secondary"
          >
            Cancel
          </Button>
        ) : null}
        <Button
          size="sm"
          onClick={() => {
            postComment({ comment });
          }}
          disabled={!comment.trim().length || isLoading}
        >
          Publish
        </Button>
      </div>
    </div>
  );
};

export default CommentForm;
