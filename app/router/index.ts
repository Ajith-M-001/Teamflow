//app\router\index.ts
import { createWorkspaces, listWorkspaces } from "@/app/router/workspace";

export const router = {
  workspace: {
    list: listWorkspaces,
    create: createWorkspaces,
  },
};
