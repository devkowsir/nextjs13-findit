"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/useToast";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

const Editor = ({ topicName }: { topicName: string }) => {
  const router = useRouter();
  const editorRef = useRef<EditorJS>(null);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  // const [isMounted, setisMounted] = useState<boolean>(false);
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<PostCreationRequest>({
    // @ts-ignore
    resolver: zodResolver(PostValidator),
    defaultValues: {
      title: "",
      content: null,
      topicName,
    },
  });
  const { ref: titleRef, ...restTitleOpts } = register("title");

  const { mutate: createPost } = useMutation({
    async mutationFn(payload: PostCreationRequest) {
      const { data } = await axios.post("/api/post/create", payload);
      return data;
    },
    onError(err: any) {
      return toast({
        title: "Something went wrong",
        description: err?.message || "Your post has not been created.",
        variant: "destructive",
      });
    },
    onSuccess() {
      router.replace(`/t/${topicName}`);
      router.refresh();

      return toast({
        title: "Your post has been succesfully published.",
      });
    },
  });

  const onSubmit = async (data: PostCreationRequest) => {
    const content = await editorRef.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content,
      topicName,
    };

    createPost(payload);
  };

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Table = (await import("@editorjs/table"!)).default;
    const List = (await import("@editorjs/list"!)).default;
    const Embed = (await import("@editorjs/embed"!)).default;
    const Code = (await import("@editorjs/code"!)).default;
    const LinkTool = (await import("@editorjs/link"!)).default;
    const InlineCode = (await import("@editorjs/inline-code"!)).default;
    const ImageTool = (await import("@editorjs/image"!)).default;

    if (!editorRef.current) {
      const editor = new EditorJS({
        hideToolbar: false,
        holder: "editor",
        onReady() {
          // @ts-ignore
          editorRef.current = editor;
        },
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "http://localhost:3000/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: { uploadByFile: uploadToCloudinary },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    titleRef;
    const init = () => {
      setTimeout(async () => {
        await initializeEditor();
        _titleRef.current?.focus();
      }, 0);
    };
    init();
    return () => {
      editorRef.current?.destroy();
      // @ts-ignore
      editorRef.current = null;
    };
  }, [initializeEditor]);

  useEffect(() => {
    for (const [_, value] of Object.entries(errors)) {
      toast({ description: (value as { message: string }).message });
    }
  }, [errors]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="prose prose-slate rounded-md border border-slate-300 dark:prose-invert">
        <TextareaAutosize
          ref={(e) => {
            titleRef(e);
            // @ts-ignore
            _titleRef.current = e;
          }}
          {...restTitleOpts}
          className="w-full resize-none appearance-none overflow-hidden rounded-md bg-transparent px-4 py-2 text-4xl font-bold focus-visible:outline-none"
          placeholder="Title"
        />
        <div className="min-h-[500px] px-4" id="editor"></div>
      </div>
      <Button type="submit" className="w-full">
        Post
      </Button>
    </form>
  );
};

export default Editor;
