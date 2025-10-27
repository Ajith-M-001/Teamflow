//app\router\index.ts
import { listWorkspaces } from "./workspace";

export const router = {
  workspace: {
    list: listWorkspaces,
  },
};
