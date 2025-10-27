import { z } from "zod";

const WORKSPACE_NAME_LIMITS = {
  MIN: 2,
  MAX: 50,
} as const;

export const workspaceSchema = z.object({
  name: z
    .string()
    .min(
      WORKSPACE_NAME_LIMITS.MIN,
      `Workspace name must be at least ${WORKSPACE_NAME_LIMITS.MIN} characters long`
    )
    .max(
      WORKSPACE_NAME_LIMITS.MAX,
      `Workspace name must be at most ${WORKSPACE_NAME_LIMITS.MAX} characters long`
    ),
});

export type Workspace = z.infer<typeof workspaceSchema>;
export { WORKSPACE_NAME_LIMITS };
