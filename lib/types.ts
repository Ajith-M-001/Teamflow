import { Message } from "@/prisma/generated/prisma";
import { GroupedReactionSchemaType } from "../components/schemas/message";

export type MessageListItem = Message & {
  repliesCount: number;
  reactions: GroupedReactionSchemaType[];
};
