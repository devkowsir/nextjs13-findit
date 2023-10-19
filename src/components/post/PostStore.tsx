"use client";

import { ExtendedPost } from "@/types/db";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface PostStore {
  post: ExtendedPost;
  setPost: Dispatch<SetStateAction<ExtendedPost>>;
}

export const PostContext = createContext<PostStore | null>(null);

const PostProvider = ({
  initialPost,
  children,
}: {
  initialPost: ExtendedPost;
  children: React.ReactNode;
}) => {
  const [post, setPost] = useState<ExtendedPost>(initialPost);

  return (
    <PostContext.Provider
      value={{
        post,
        setPost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const Post = useContext(PostContext);
  if (!Post)
    throw "Comment context value is null. Please make sure that context is provided to this component.";
  return Post;
};

export default PostProvider;
