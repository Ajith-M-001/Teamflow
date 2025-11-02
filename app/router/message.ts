import { base } from "../middlewares/base";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import { standardSecurityMiddleware } from "../middlewares/arcjet/standard";
import { writeSecurityMiddleware } from "../middlewares/arcjet/write";
import z from "zod";
import prisma from "@/lib/db";
import { createMessageSchema } from "@/components/schemas/message";
import { getAvatar } from "@/lib/get-avatar";
import { Message } from "@/prisma/generated/prisma";

export const createMessage = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .use(standardSecurityMiddleware)
  .use(writeSecurityMiddleware)
  .route({
    method: "POST",
    path: "/messages",
    summary: "create a new message",
    tags: ["message"],
  })
  .input(createMessageSchema)
  .output(z.custom<Message>())
  .handler(async ({ context, input, errors }) => {
    // verify the channel belongs to the user's organization

    const channel = await prisma.channel.findFirst({
      where: {
        id: input.channelId,
        workspaceId: context.workspace.orgCode,
      },
    });

    if (!channel) {
      throw errors.FORBIDDEN();
    }

    const created = await prisma.message.create({
      data: {
        content: input.content,
        channelId: input.channelId,
        imageUrl: input.imageUrl,
        authorId: context.user.id,
        authorEmail: context.user.email!,
        authorName: context.user.given_name ?? "john doe",
        authorAvatar: getAvatar(context.user.picture, context.user.email!),
      },
    });

    return { ...created };
  });
