import z from "zod";
import { requiredAuthMiddleware } from "../middlewares/auth";
import { base } from "../middlewares/base";
import { requiredWorkspaceMiddleware } from "../middlewares/workspace";
import prisma from "@/lib/db";
import { jsonToMarkdown } from "@/lib/json-to-markdown";
import { streamText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamToEventIterator } from "@orpc/server";

// 🧠 Custom summarization system prompt
const system = [
  "You are an expert assistant summarizing Slack-like discussion threads for a product team.",
  "Use only the provided thread content; do not invent facts, names, or timelines.",
  "",
  "Output format (Markdown):",
  "- First, write a single concise paragraph (2–4 sentences) that captures the thread's purpose, key decisions, context, and any blockers or next steps. No heading, no list, no intro text.",
  "- Then add a blank line followed by exactly 2–3 bullet points (using '-') with the most important takeaways. Each bullet is one sentence.",
  "",
  "Style: neutral, specific, and concise. Preserve terminology from the thread (names, acronyms). Avoid filler or meta-commentary. Do not add a closing sentence.",
  "If the context is insufficient, return a single-sentence summary and omit the bullet list.",
].join("\n");

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY as string,
});

const MODEL_ID = "z-ai/glm-4.5-air:free";

export const generateThreadSummary = base
  .use(requiredAuthMiddleware)
  .use(requiredWorkspaceMiddleware)
  .route({
    method: "GET",
    path: "/ai/thread/summary",
    summary: "Generate AI summary for a message thread",
    tags: ["ai"],
  })
  .input(z.object({ messageId: z.string() }))
  .handler(async ({ context, input, errors }) => {
    // Fetch message and thread metadata
    const baseMessage = await prisma.message.findFirst({
      where: {
        id: input.messageId,
        channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
        threadId: true,
        channelId: true,
      },
    });

    if (!baseMessage) throw errors.NOT_FOUND();

    const parentId = baseMessage.threadId ?? baseMessage.id;

    // Fetch parent message and replies
    const parent = await prisma.message.findFirst({
      where: {
        id: parentId,
        channel: {
          workspaceId: context.workspace.orgCode,
        },
      },
      select: {
        id: true,
        content: true,
        authorName: true,
        createdAt: true,
        replies: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            content: true,
            authorName: true,
            createdAt: true,
          },
        },
      },
    });

    if (!parent) throw errors.NOT_FOUND();

    // Convert messages to Markdown text
    const parentText = jsonToMarkdown(parent.content);

    const lines: string[] = [];
    lines.push(
      `Thread Root - ${parent.authorName} - ${parent.createdAt.toISOString()}`
    );
    lines.push(parentText);

    if (parent.replies.length > 0) {
      lines.push("\nReplies:");
      for (const reply of parent.replies) {
        const replyText = jsonToMarkdown(reply.content);
        lines.push(`- ${reply.authorName} - ${reply.createdAt.toISOString()}`);
        lines.push(replyText);
      }
    }

    const compiled = lines.join("\n\n");

    // 🧠 Stream AI summary response
    const result = streamText({
      model: openrouter.chat(MODEL_ID),
      messages: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: compiled,
        },
      ],
      temperature: 0.2,
    });

    // Return a streaming response to the frontend
    return streamToEventIterator(result.toUIMessageStream());
  });
