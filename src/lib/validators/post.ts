import { z } from "zod";

export const PostCreationValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 character long." })
    .max(128, { message: "Title cannot be more than 3 character long." }),
  content: z.any(),
  topicName: z.string(),
});

export const PostUpdateValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 character long." })
    .max(128, { message: "Title cannot be more than 3 character long." }),
  content: z.any(),
  postId: z.string(),
});

export type PostCreationPayload = z.infer<typeof PostCreationValidator>;
export type PostUpdatePayload = z.infer<typeof PostUpdateValidator>;
