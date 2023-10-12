"use client";

import Editor from "@/components/editor/Editor";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/useToast";
import { PostUpdatePayload, PostUpdateValidator } from "@/lib/validators/post";
import { ExtendedPost } from "@/types/db";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

interface EditFormProps {
  post: ExtendedPost;
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const EditForm = ({ post }: EditFormProps) => {
  const router = useRouter();
  const editorRef = useRef<EditorJS>(null);

  const {
    formState: { errors, isValid },
    register,
    handleSubmit,
  } = useForm<PostUpdatePayload>({
    // @ts-ignore
    resolver: zodResolver(PostUpdateValidator),
    defaultValues: {
      title: post.title,
      content: post.content,
      postId: post.id,
    },
  });

  const { mutate: createPost, isLoading } = useMutation({
    async mutationFn(payload: PostUpdatePayload) {
      const { data } = await axios.patch("/api/post", payload);
      return data;
    },
    onError(err: any) {
      return toast({
        title: "Something went wrong",
        description: err?.message || "Your post has not been updated.",
        variant: "destructive",
      });
    },
    onSuccess() {
      router.replace(`/t/${post.topicName}/post/${post.id}`);
      router.refresh();

      return toast({
        title: "Your post has been succesfully deleted.",
      });
    },
  });

  const onSubmit = async (data: PostUpdatePayload) => {
    const content = await editorRef.current?.save();

    const payload: PostUpdatePayload = {
      title: data.title,
      content,
      postId: post.id,
    };

    createPost(payload);
  };

  useEffect(() => {
    for (const [_, value] of Object.entries(errors)) {
      toast({
        title: (value as { message: string }).message,
        variant: "destructive",
      });
    }
  }, [errors]);

  return (
    <form
      name="update-post-form"
      className="space-y-4 dark:prose-invert"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="prose prose-slate w-full rounded-md border border-slate-300 px-4 py-2 lg:max-w-full">
        <TextareaAutosize
          {...register("title")}
          className="w-full resize-none appearance-none overflow-hidden rounded-md bg-transparent py-2 text-4xl font-bold focus-visible:outline-none"
          placeholder="Title"
        />
        <Editor editorRef={editorRef} data={post.content} />
      </div>
      <div className="flex flex-col-reverse gap-2 pb-12 sm:flex-row sm:justify-end sm:gap-4">
        <Button variant={"outline"} type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button disabled={!isValid || isLoading} type="submit">
          Update Post
        </Button>
      </div>
    </form>
  );
};

export default EditForm;
