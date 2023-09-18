import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 character long." })
    .max(128, { message: "Title cannot be more than 3 character long." }),
  content: z.any(),
  topicName: z.string(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
