"use client";

import ChooseTopic from "@/components/ChooseTopic";
import Editor from "@/components/editor/Editor";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/useToast";
import {
  PostCreationPayload,
  PostCreationValidator,
} from "@/lib/validators/post";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

interface CreateFormProps {
  topicName?: string;
}

const CreateForm = ({ topicName: initialTopicName }: CreateFormProps) => {
  const router = useRouter();
  const editorRef = useRef<EditorJS>(null);
  const [topicName, setTopicName] = useState(initialTopicName || "");

  const {
    formState: { errors, isValid },
    register,
    handleSubmit,
  } = useForm<PostCreationPayload>({
    // @ts-ignore
    resolver: zodResolver(PostCreationValidator),
    defaultValues: {
      title: "",
      content: null,
      topicName,
    },
  });

  const { mutate: createPost } = useMutation({
    async mutationFn(payload: PostCreationPayload) {
      const { data } = await axios.post("/api/post", payload);
      return data;
    },
    onError(err: any) {
      return toast({
        title: "Something went wrong",
        description: err?.message || "Your post has not been created.",
        variant: "destructive",
      });
    },
    onSuccess(_, variables) {
      router.replace(`/t/${variables.topicName}`);
      router.refresh();

      return toast({
        title: "Your post has been succesfully published.",
      });
    },
  });

  const onSubmit = async (data: PostCreationPayload) => {
    const content = await editorRef.current?.save();

    const payload: PostCreationPayload = {
      title: data.title,
      content,
      topicName,
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
      className="space-y-4 dark:prose-invert"
      onSubmit={handleSubmit(onSubmit)}
    >
      <ChooseTopic setTopicName={setTopicName} topicName={topicName} />
      <div className="prose prose-slate w-full rounded-md border border-slate-300 px-4 py-2 lg:max-w-full">
        <TextareaAutosize
          {...register("title")}
          className="w-full resize-none appearance-none overflow-hidden rounded-md bg-transparent py-2 text-4xl font-bold focus-visible:outline-none"
          placeholder="Title"
        />
        <Editor editorRef={editorRef} />
      </div>
      <div className="flex flex-col-reverse gap-2 pb-12 sm:flex-row sm:justify-end sm:gap-4">
        <Button variant={"outline"} type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button disabled={!isValid} type="submit">
          Create Post
        </Button>
      </div>
    </form>
  );
};

export default CreateForm;
