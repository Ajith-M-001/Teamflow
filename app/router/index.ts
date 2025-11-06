//app\router\index.ts
import { createWorkspaces, listWorkspaces } from "@/app/router/workspace";
import { createChannel, getChannel, listChannels } from "./channel";
import { createMessage, listMessages, updateMessage } from "./message";
import { inviteMember, listMembers } from "./member";

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspaces,
    member: {
      invite: inviteMember,
      list: listMembers,
    },
  },
  channel: {
    create: createChannel,
    list: listChannels,
    get: getChannel,
  },
  message: {
    create: createMessage,
    list: listMessages,
    update: updateMessage,
  },
};
