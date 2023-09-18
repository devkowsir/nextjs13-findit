"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false },
);

interface EditorOutputProps {
  data: any;
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const renderers = {
  image: imageRenderer,
  code: codeRenderer,
};

const EditorOutput: React.FC<EditorOutputProps> = ({ data }) => {
  return (
    <Output
      classNames="text-slate-800"
      data={data}
      style={style}
      renderers={renderers}
    />
  );
};

export default EditorOutput;

function imageRenderer({ data }: any) {
  return (
    <div className="relative min-h-[15rem] w-full">
      <Image
        alt={data.caption}
        src={data.file.url}
        className="object-contain"
        fill
      />
    </div>
  );
}

function codeRenderer({ data }: any) {
  return (
    <pre className="rounded-md bg-slate-800 p-4">
      <code className="text-sm text-slate-100">{data.code}</code>
    </pre>
  );
}
