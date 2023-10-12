import CreateForm from "@/components/post/CreateForm";
import { GeneralPostingRules } from "@/config";

const page = () => {
  return (
    <div className="container mx-auto grid grid-cols-1 gap-6 md:grid-cols-3 lg:max-w-5xl">
      <div className="h-fit rounded-md border border-slate-300 bg-slate-100 p-4 md:order-last">
        <h2 className="pb-1 text-xl font-medium text-slate-700">
          Posting to FindIt
        </h2>
        <ul className="divide-y border-y text-sm text-slate-700">
          {GeneralPostingRules.map((rule, index) => (
            <li className="py-1" key={index}>
              {rule}
            </li>
          ))}
        </ul>
      </div>
      <div className="md:col-span-2">
        <h1 className="mb-4 text-3xl font-semibold text-slate-700">
          Create Post
        </h1>
        <CreateForm />
      </div>
    </div>
  );
};

export default page;
