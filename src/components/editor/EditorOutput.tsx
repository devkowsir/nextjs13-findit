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
  return <Output style={style} data={data} renderers={renderers} />;
};

export default EditorOutput;

function imageRenderer({ data }: any) {
  return (
    <Image
      alt={data.caption}
      src={data.file.url}
      width={data.file.width}
      height={data.file.height}
      className="my-0"
    />
  );
}

function codeRenderer({ data }: any) {
  return (
    <pre className="rounded-md bg-slate-800 p-4">
      <code className="text-sm text-slate-100">{data.code}</code>
    </pre>
  );
}
