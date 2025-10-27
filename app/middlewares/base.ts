import { os } from "@orpc/server";

export const base = os.$context<{ request: Request }>().errors({
  RATE_LIMITED: {
    message: "You are being rate limited.",
  },
  BAD_REQUEST: {
    message: "Bad request.",
  },
  UNAUTHORIZED: {
    message: "Unauthorized.",
  },
  NOT_FOUND: {
    message: "Not found.",
  },
  FORBIDDEN: {
    message: "Forbidden.",
  },
  INTERNAL_SERVER_ERROR: {
    message: "Internal server error.",
  },
});
