//app\router\workspace.ts

import { KindeOrganization, KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { z } from "zod";
import { base } from "@/app/middlewares/base";
import { requiredAuthMiddleware } from "./auth";

export const listWorkspaces = base
  .use(requiredAuthMiddleware)
  .route({
    method: "GET",
    path: "/workspaces",
    summary: "List all workspaces",
    tags: ["Workspace"],
  })
  .input(z.void())
  .output(
    z.object({
      workspace: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          avatar: z.string(),
        })
      ),
      user: z.custom<KindeUser<Record<string, unknown>>>(),
      currentWorkspace: z.custom<KindeOrganization<unknown>>(),
    })
  )
  .handler(async ({ input, context }) => {
    const { getUserOrganizations } = getKindeServerSession();
    const organizations = await getUserOrganizations();
    return {
      workspace: organizations?.orgs.map((org) => ({
        id: org.code,
        name: org.name,
        avatar: org.name?.charAt(0),
      })),
      user: context.user,
      currentWorkspace: {},
    };
  });
