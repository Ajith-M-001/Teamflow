import z from "zod";

const MESSAGE_LIMITS = {
  MIN: 1,
  MAX: 2000,
} as const;

export const createMessageSchema = z.object({
  channelId: z.string(),
  content: z
    .string()
    .min(
      MESSAGE_LIMITS.MIN,
      `Message must be at least ${MESSAGE_LIMITS.MIN} character`
    )
    .max(
      MESSAGE_LIMITS.MAX,
      `Message must be at most ${MESSAGE_LIMITS.MAX} characters`
    ),
  imageUrl: z.url().optional(),
  threadId: z.string().optional(),
});

export const updateMessageSchema = z.object({
  messageId: z.string(),
  content: z
    .string()
    .min(
      MESSAGE_LIMITS.MIN,
      `Message must be at least ${MESSAGE_LIMITS.MIN} character`
    )
    .max(
      MESSAGE_LIMITS.MAX,
      `Message must be at most ${MESSAGE_LIMITS.MAX} characters`
    ),
});


export const toggleReactionSchema = z.object({
  messageId: z.string(),
  emoji: z.string().min(1),
});

export const GroupedReactionSchema = z.object({
  emoji: z.string(),
  count: z.number(),
  reactedByMe: z.boolean(),
})

export type GroupedReactionSchemaType = z.infer<typeof GroupedReactionSchema>;
export type ToggleReactionSchemaType = z.infer<typeof toggleReactionSchema>;
export type CreateMessageSchemaType = z.infer<typeof createMessageSchema>;
export type UpdateMessageSchemaType = z.infer<typeof updateMessageSchema>;
export { MESSAGE_LIMITS };
