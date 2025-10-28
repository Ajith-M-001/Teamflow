//app\middlewares\base.ts

import { os } from "@orpc/server";

export const base = os.$context<{ request: Request }>().errors({
  RATE_LIMITED: {
    code: 429,
    message: "you have been rate limited",
  },
  BAD_REQUEST: {
    code: 400,
    message: "bad request",
  },
  UNAUTHORIZED: {
    code: 401,
    message: "unauthorized",
  },
  NOT_FOUND: {
    code: 404,
    message: "not found",
  },
  FORBIDDEN: {
    code: 403,
    message: "forbidden",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: "internal server error",
  },
});
