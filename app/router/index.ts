//app\router\index.ts
import { createWorkspaces, listWorkspaces } from "@/app/router/workspace";
import { createChannel, listChannels } from "./channel";

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspaces,
  },
  channel: {
    create: createChannel,
    list: listChannels,
  },
};
