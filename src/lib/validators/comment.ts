import { z } from "zod";

export const CommentCreationValidator = z.object({
  text: z.string().min(1),
  postId: z.string(),
  replyToId: z.string().optional().nullable(),
});

export type CommentCreationPayload = z.infer<typeof CommentCreationValidator>;

export const CommentUpdateValidator = z.object({
  text: z.string().min(1).max(1024),
  commentId: z.string().cuid(),
});

export type CommentUpdatePayload = z.infer<typeof CommentUpdateValidator>;
