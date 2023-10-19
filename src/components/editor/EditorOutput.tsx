import { Content } from "@/types/db";
import Blocks, { RenderFn } from "editorjs-blocks-react-renderer";
// @ts-ignore
import HTMLReactParser from "html-react-parser";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface ImageRenderProps {
  caption: string;
  file: { url: string; width: number; height: number; public_id: string };
  stretched: boolean;
  withBackground: boolean;
  withBorder: boolean;
}

interface LinkToolRenderProps {
  link: string;
  meta: {
    title?: string;
    description?: string;
    image?: { url: string };
  };
}

const CustomLinkToolRender: RenderFn<LinkToolRenderProps> = ({ data }) => {
  const {
    link,
    meta: { title, description, image },
  } = data;

  return (
    <a className="not-prose link-tool" href={data.link} target="_blank">
      <div className="meta">
        {title && <p className="title">{HTMLReactParser(title)}</p>}
        {description && (
          <p className="description">{HTMLReactParser(description)}</p>
        )}
        <span className="host flex items-center gap-2 pt-2">
          {HTMLReactParser(new URL(link).host)}
          <ExternalLink size={16} />
        </span>
      </div>
      {image?.url && (
        <div
          className="image"
          style={{ backgroundImage: `url(${image?.url})` }}
        ></div>
      )}
    </a>
  );
};

const CustomImageRender: RenderFn<ImageRenderProps> = ({ data }) => {
  const image = (
    <Image
      alt={data.caption}
      src={data.file.url}
      width={data.file.width}
      height={data.file.height}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 512px, 640px"
      quality={90}
    />
  );

  return data.caption ? (
    <figure>
      {image}
      <figcaption>{HTMLReactParser(data.caption)}</figcaption>
    </figure>
  ) : (
    image
  );
};

const renderers = {
  image: CustomImageRender,
  linkTool: CustomLinkToolRender,
};

const EditorOutput = ({ data }: { data: Content }) => (
  <Blocks data={data} renderers={renderers} />
);

export default EditorOutput;
