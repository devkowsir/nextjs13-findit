"use client";

import CreateForm from "@/components/post/CreateForm";

interface PageProps {
  params: { topicName?: string };
}

const page = ({ params: { topicName } }: PageProps) => {
  return (
    <div className="md:col-span-2">
      <h1 className="mb-4 text-3xl font-semibold text-slate-700">
        Create Post
      </h1>
      <CreateForm topicName={topicName} />
    </div>
  );
};

export default page;
