//app\middlewares\arcjet\standard.ts

import arcjet, { detectBot, shield } from "@/lib/arcjet";
import { base } from "@/app/middlewares/base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const buildStandardAj = arcjet
  .withRule(
    shield({
      mode: "LIVE",
    })
  )
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW", "CATEGORY:MONITOR"],
    })
  );

export const standardSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    const decision = await buildStandardAj.protect(context.request, {
      userId: context.user.id,
    });

    if (decision.isDenied()) {
      const reason = decision.reason;

      if (reason?.isBot?.()) {
        throw errors.FORBIDDEN({ message: "Automated traffic blocked" });
      }

      if (reason?.isShield?.()) {
        throw errors.FORBIDDEN({
          message: "Request blocked by security policy (WAF)",
        });
      }

      throw errors.FORBIDDEN({ message: "Request Blocked!" });
    }

    return next();
  });
