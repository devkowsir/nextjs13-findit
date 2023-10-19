import { random } from "@/lib/utils";
import { SkeletonText } from "../Skeleton";

const PostFallBack = () => {
  return (
    <li className="rounded-md bg-white p-4">
      <div className="flex gap-8">
        <SkeletonText className="opacity-70" noOfWords={1} fontSize={12} />
        <SkeletonText
          className="opacity-60"
          noOfWords={random(1, 2)}
          fontSize={12}
        />
        <SkeletonText
          className="opacity-60"
          noOfWords={random(1, 2)}
          fontSize={12}
        />
      </div>
      <SkeletonText
        className="mb-2 mt-4"
        noOfWords={random(5, 10)}
        fontSize={24}
      />
      <SkeletonText
        className="my-2 opacity-70"
        noOfWords={random(10, 20)}
        fontSize={16}
      />
      {/* <div className="flex p-3 shadow hover:cursor-pointer hover:shadow-md">
        <div className="flex flex-col gap-2">
          <SkeletonText
            className="opacity-80"
            noOfWords={random(5, 7)}
            fontSize={16}
          />
          <SkeletonText
            className="opacity-60"
            noOfWords={random(8, 12)}
            fontSize={14}
          />
          <SkeletonText
            className="mt-auto opacity-70"
            noOfWords={random(3, 4)}
            fontSize={14}
          />
        </div>
        <div className="skeleton aspect-square h-fit w-24"></div>
      </div> */}
      <div className="mt-4 flex gap-4">
        <SkeletonText
          className="opacity-60"
          noOfWords={random(1, 2)}
          fontSize={24}
        />
        <SkeletonText
          className="opacity-60"
          noOfWords={random(1, 2)}
          fontSize={24}
        />
      </div>
    </li>
  );
};

export default PostFallBack;
