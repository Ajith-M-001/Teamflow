import arcjet, { slidingWindow } from "@/lib/arcjet";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { base } from "../base";

const buildWriteArcjet =arcjet.withRule(
    slidingWindow({
      mode: "LIVE",
      interval: "1m",
      max: 40,
    })
  );

export const writeSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    if (!context.user?.id) {
      throw errors.UNAUTHORIZED({ message: "User not authenticated." });
    }

    const decision = await buildWriteArcjet.protect(context.request, {
      userId: context.user.id,
    });

    if (decision.isDenied()) {
      const reason = decision.reason;

      if (reason?.isRateLimit?.()) {
        throw errors.RATE_LIMITED({
          message: "Too many impactful changes. Please slow down.",
        });
      }

      throw errors.FORBIDDEN({
        message: "Request blocked.",
      });
    }

    return next();
  });
