import z from "zod";

const MEMBER_NAME_LIMITS = {
  MIN: 2,
  MAX: 100,
} as const;

export const InviteMemberSchema = z.object({
  name: z
    .string()
    .min(
      MEMBER_NAME_LIMITS.MIN,
      `Name must be at least ${MEMBER_NAME_LIMITS.MIN} characters long`
    )
    .max(
      MEMBER_NAME_LIMITS.MAX,
      `Name must be at most ${MEMBER_NAME_LIMITS.MAX} characters long`
    ),
  email: z.email(),
});

export type InviteMemberSchemaType = z.infer<typeof InviteMemberSchema>;

export { MEMBER_NAME_LIMITS };
