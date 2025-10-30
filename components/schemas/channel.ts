import { z } from "zod";

const CHANNEL_NAME_LIMITS = {
  MIN: 2,
  MAX: 50,
} as const;

export function transformChannelName(name: string): string {
  return name
    .toLowerCase()
    .trim() // remove leading/trailing spaces before replacing
    .replace(/\s+/g, "-") // replace spaces/tabs/newlines with hyphens
    .replace(/[^a-z0-9-]/g, "") // remove special characters; keep letters, numbers, and dashes
    .replace(/-+/g, "-") // collapse multiple hyphens into one
    .replace(/^-|-$/g, ""); // remove leading/trailing hyphens
}

export const ChannelNameSchema = z.object({
  name: z
    .string()
    .min(
      CHANNEL_NAME_LIMITS.MIN,
      `Channel name must be at least ${CHANNEL_NAME_LIMITS.MIN} characters long`
    )
    .max(
      CHANNEL_NAME_LIMITS.MAX,
      `Channel name must be at most ${CHANNEL_NAME_LIMITS.MAX} characters long`
    )
    .transform((name, ctx) => {
      const transformed = transformChannelName(name);
      if (transformed.length < CHANNEL_NAME_LIMITS.MIN) {
        ctx.addIssue({
          code: "custom",
          message: `Channel name must be at least ${CHANNEL_NAME_LIMITS.MIN} characters long`,
        });
        return z.NEVER;
      }
      return transformed;
    }),
});

export type ChannelNameSchemaType = z.infer<typeof ChannelNameSchema>;
export { CHANNEL_NAME_LIMITS };
