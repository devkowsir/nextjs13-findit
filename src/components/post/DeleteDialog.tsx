"use client";

import { toast } from "@/hooks/useToast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import Dialog, { useDialogStore } from "../ui/dialog";

interface DeleteDialogProps {
  postId: string;
}

const DeleteDialog = ({ postId }: DeleteDialogProps) => {
  const router = useRouter();
  const { dialogToShow, setDialogToShow } = useDialogStore();

  const { mutate: deletePost, isLoading } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/post?postId=${postId}`);
    },
    onError(err: any) {
      return toast({
        title: "Something went wrong",
        description: err?.message || "Your post has not been updated.",
        variant: "destructive",
      });
    },
    onSuccess() {
      router.replace(`/`);
      router.refresh();

      return toast({
        title: "Your post has been succesfully updated.",
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
        You won&apos;t be able to recover this post. Are you sure you want to
        delete this post?
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
          onClick={() => deletePost()}
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
        onClick={() => setDialogToShow("delete-post")}
      >
        <Trash2 size={24} />
        <span>Delete</span>
      </Button>
      {dialogToShow === "delete-post" && dialog}
    </>
  );
};

export default DeleteDialog;
