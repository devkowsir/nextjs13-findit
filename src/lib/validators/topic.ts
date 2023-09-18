import { NAME_REGEX } from "@/config";
import { z } from "zod";

export const TopicValidator = z.object({
  name: z
    .string()
    .min(3)
    .max(21)
    .regex(
      NAME_REGEX,
      "Cannot include space or any special character except _",
    ),
});

export const TopicSubscriptionValidator = z.object({
  topicName: z.string(),
});

export type CreateTopicPayload = z.infer<typeof TopicValidator>;
export type SubscribeToTopicPayload = z.infer<
  typeof TopicSubscriptionValidator
>;
