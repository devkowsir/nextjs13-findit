"use client";

import { toast } from "@/hooks/useToast";
import { CommentUpdatePayload } from "@/lib/validators/comment";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { PenSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import Dialog, { useDialogStore } from "../ui/dialog";
import { useComment } from "./CommentStore";

interface EditProps {
  commentId: string;
  text: string;
}

const Edit = ({ commentId, text }: EditProps) => {
  const { dialogToShow, setDialogToShow } = useDialogStore();
  const [comment, setComment] = useState<string>(text);
  const { updateComment: updateCommentCache } = useComment();

  const { mutate: updateComment, isLoading } = useMutation({
    async mutationFn({ comment }: { comment: string }) {
      const payload: CommentUpdatePayload = {
        commentId,
        text: comment,
      };

      const { data } = await axios.patch("/api/comment", payload);
      return data as string;
    },
    onError() {
      return toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    },
    onSuccess(text) {
      setDialogToShow(null);
      updateCommentCache(commentId, { text });
      return toast({
        title: "Your comment has been successfully published.",
      });
    },
  });

  const dialog = (
    <Dialog onCloseAction={() => setDialogToShow(null)}>
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
        />
        <div className="flex justify-end gap-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setDialogToShow(null)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => {
              updateComment({ comment });
            }}
            disabled={!comment.trim().length || isLoading}
          >
            Update
          </Button>
        </div>
      </div>
    </Dialog>
  );

  return (
    <>
      <Button
        variant={"secondary"}
        size={"xs"}
        onClick={() => setDialogToShow("edit-comment")}
      >
        <PenSquare size={24} />
        <span>Edit</span>
      </Button>
      {dialogToShow === "edit-comment" && dialog}
    </>
  );
};

export default Edit;
