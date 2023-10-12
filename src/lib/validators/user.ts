import { USERNAME_REGEX } from "@/config";
import { z } from "zod";

export const ProfileChangeRequestValidator = z.object({
  username: z
    .string()
    .regex(USERNAME_REGEX, "[a-zA-Z][a-z0-9A-Z-_]*[a-zA-Z0-9]$")
    .min(3)
    .max(20)
    .optional(),
  bio: z.string().max(1024).optional(),
});

export type ProfileChangeRequestPayload = z.infer<
  typeof ProfileChangeRequestValidator
>;

export const FollowToggleRequestValidator = z.object({
  username: z.string(),
});

export type FollowTogglePayload = z.infer<typeof FollowToggleRequestValidator>;
