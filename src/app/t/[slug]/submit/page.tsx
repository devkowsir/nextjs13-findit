import Editor from "@/components/Editor";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface pageProps {
  params: { slug: string };
}

const page: React.FC<pageProps> = async ({ params: { slug } }) => {
  const topic = await prisma.topic.findUnique({ where: { name: slug } });

  if (!topic) return notFound();

  return (
    <div className="w-full space-y-4 rounded-lg bg-slate-100 px-8 py-6">
      <h1 className="w-fit border-b border-slate-300 pb-2 text-2xl">
        <span className="font-bold">Create Post</span> in t/{slug}
      </h1>
      <Editor topicName={topic.name} />
    </div>
  );
};

export default page;
