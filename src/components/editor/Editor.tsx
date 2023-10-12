"use client";

import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import type EditorJS from "@editorjs/editorjs";
import { RefObject, useCallback, useEffect } from "react";

const Editor = ({
  editorRef,
  data,
}: {
  editorRef: RefObject<EditorJS>;
  data?: any;
}) => {
  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    // const Header = (await import("@editorjs/header")).default;
    const Table = (await import("@editorjs/table"!)).default;
    const List = (await import("@editorjs/list"!)).default;
    const Embed = (await import("@editorjs/embed"!)).default;
    const Code = (await import("@editorjs/code"!)).default;
    const LinkTool = (await import("@editorjs/link"!)).default;
    const InlineCode = (await import("@editorjs/inline-code"!)).default;
    const ImageTool = (await import("@editorjs/image"!)).default;

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editor",
        inlineToolbar: true,
        minHeight: 400,
        onReady() {
          // @ts-ignore
          editorRef.current = editor;
        },
        data: data ?? {},
        tools: {
          // header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
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
    const init = () => {
      setTimeout(async () => {
        await initializeEditor();
      }, 0);
    };
    init();
    return () => {
      editorRef.current?.destroy();
      // @ts-ignore
      editorRef.current = null;
    };
  }, [initializeEditor, editorRef]);

  return <div id="editor"></div>;
};

export default Editor;
