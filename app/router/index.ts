//app\router\index.ts
import { createWorkspaces, listWorkspaces } from "@/app/router/workspace";
import { createChannel, getChannel, listChannels } from "./channel";
import { createMessage, listMessages } from "./message";

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspaces,
  },
  channel: {
    create: createChannel,
    list: listChannels,
    get: getChannel,
  },
  message: {
    create: createMessage,
    list: listMessages,
  },
};
