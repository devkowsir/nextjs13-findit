import { NAME_REGEX } from "@/config";
import { z } from "zod";

export const TopicCreationRequestValidator = z.object({
  name: z
    .string()
    .min(3)
    .max(21)
    .regex(
      NAME_REGEX,
      "Cannot include space or any special character except _",
    ),
  description: z.string().max(1024).optional(),
});

export const TopicSubscriptionRequestValidator = z.object({
  topicName: z.string(),
});

export const TopicDescriptionChangeValidator = z.object({
  description: z.string().max(1024).nullable(),
});

export type CreateTopicPayload = z.infer<typeof TopicCreationRequestValidator>;
export type SubscribeToTopicPayload = z.infer<
  typeof TopicSubscriptionRequestValidator
>;
export type TopicDescription = z.infer<typeof TopicDescriptionChangeValidator>;
