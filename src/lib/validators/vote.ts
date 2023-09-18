import { VoteType } from "@prisma/client";
import { z } from "zod";

export const VoteValidator = z.object({
  type: z.enum([VoteType.UP, VoteType.DOWN]),
  id: z.string(),
});

export type VoteRequest = z.infer<typeof VoteValidator>;
