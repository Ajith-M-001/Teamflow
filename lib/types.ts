import { Message } from "@/prisma/generated/prisma";

export type MessageListItem = Message & {
  repliesCount: number;
};
