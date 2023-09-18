import { z } from "zod";

export const CommentValidator = z.object({
  text: z.string().min(1),
  postId: z.string(),
  replyToId: z.string().optional().nullable(),
});

export type CommentCreationPayload = z.infer<typeof CommentValidator>;
