import { InviteMemberSchema } from "@/components/schemas/member";
import { heavyWriteSecurityMiddleware } from "../middlewares/arcjet/heavy-write";
import { standardSecurityMiddleware } from "../middlewares/arcjet/standard";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import z from "zod";
import {
  init,
  organization_user,
  Organizations,
  Users,
} from "@kinde/management-api-js";
import { getAvatar } from "@/lib/get-avatar";
import { readSecurityMiddleware } from "../middlewares/arcjet/read";

export const inviteMember = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(heavyWriteSecurityMiddleware)
  .route({
    method: "POST",
    path: "/workspace/members/invite",
    summary: "invite a new workspace member",
    tags: ["members"],
  })
  .input(InviteMemberSchema)
  .output(z.void())
  .handler(async ({ input, context, errors }) => {
    const { name, email } = input;
    const { orgCode } = context.workspace;

    try {
      init();
      await Users.createUser({
        requestBody: {
          organization_code: orgCode,
          profile: {
            given_name: name,
            picture: getAvatar(null, email),
          },
          identities: [{ type: "email", details: { email } }],
        },
      });
    } catch (error) {
      console.log("errors", error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });

export const listMembers = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(readSecurityMiddleware)
  .route({
    method: "GET",
    path: "/workspace/members",
    summary: "list all workspace members",
    tags: ["members"],
  })
  .input(z.void())
  .output(z.array(z.custom<organization_user>()))
  .handler(async ({ context, errors }) => {
    try {
      init();
      const data = await Organizations.getOrganizationUsers({
        orgCode: context.workspace.orgCode,
        sort: "name_asc",
      });

      if (!data.organization_users) throw errors.NOT_FOUND();
      return data.organization_users;
    } catch (error) {
      console.log("errors", error);
      throw errors.INTERNAL_SERVER_ERROR();
    }
  });
