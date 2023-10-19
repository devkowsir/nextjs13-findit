"use client";

import { toast } from "@/hooks/useToast";
import { setInfinitePostsCache } from "@/lib/queryCacheUpdaters/infinitePostCacheUpdate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { usePost } from "../post/PostStore";
import { Button } from "../ui/button";
import Dialog, { useDialogStore } from "../ui/dialog";
import { useComment } from "./CommentStore";

interface DeleteProps {
  commentId: string;
}

const Delete = ({ commentId }: DeleteProps) => {
  const queryClient = useQueryClient();
  const { postId } = useParams() as { postId: string };
  const { dialogToShow, setDialogToShow } = useDialogStore();
  const { deleteComment: deleteCommentCache } = useComment();
  const { setPost } = usePost();

  const { mutate: deleteComment, isLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/comment?commentId=${commentId}`);
    },
    onError(err: any) {
      return toast({
        title: "Something went wrong",
        description: err?.message || "Your comment has not been deleted.",
        variant: "destructive",
      });
    },
    onSuccess() {
      deleteCommentCache(commentId);
      setDialogToShow(null);
      setInfinitePostsCache(
        postId,
        (old) => ({ ...old, commentsCount: old.commentsCount + 1 }),
        queryClient,
      );
      setPost((prev) => ({ ...prev, commentsCount: prev.commentsCount - 1 }));

      return toast({
        title: "Your comment has been succesfully deleted.",
      });
    },
  });

  const dialog = (
    <Dialog
      onCloseAction={() => {
        setDialogToShow(null);
      }}
    >
      <p className="pb-4">
        You won&apos;t be able to recover this comment. Are you sure you want to
        delete this comment?
      </p>
      <div className="flex justify-center gap-2">
        <Button
          size={"sm"}
          variant={"outline"}
          type="button"
          onClick={() => setDialogToShow(null)}
        >
          Cancel
        </Button>
        <Button
          size={"sm"}
          onClick={() => deleteComment()}
          variant={"destructive"}
          disabled={isLoading}
        >
          Delete
        </Button>
      </div>
    </Dialog>
  );

  return (
    <>
      <Button
        variant={"secondary"}
        size={"xs"}
        onClick={() => setDialogToShow("delete-comment")}
      >
        <Trash2 size={24} />
        <span>Delete</span>
      </Button>
      {dialogToShow === "delete-comment" && dialog}
    </>
  );
};

export default Delete;
