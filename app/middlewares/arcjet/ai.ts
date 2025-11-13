import aj, {
  detectBot,
  sensitiveInfo,
  shield,
  slidingWindow,
} from "@/lib/arcjet";
import { base } from "../base";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";

const buildAiAj = () =>
  aj
    .withRule(shield({ mode: "LIVE" }))
    .withRule(slidingWindow({ mode: "LIVE", interval: "1m", max: 3 }))
    .withRule(
      detectBot({
        mode: "LIVE",
        allow: [
          "CATEGORY:SEARCH_ENGINE",
          "CATEGORY:PREVIEW",
          "CATEGORY:MONITOR",
        ],
      })
    )
    .withRule(
      sensitiveInfo({
        mode: "LIVE",
        deny: ["CREDIT_CARD_NUMBER", "PHONE_NUMBER", "EMAIL", "IP_ADDRESS"],
      })
    );

// 🧠 Middleware definition
export const aiSecurityMiddleware = base
  .$context<{
    request: Request;
    user: KindeUser<Record<string, unknown>>;
  }>()
  .middleware(async ({ context, next, errors }) => {
    if (!context.user?.id) {
      throw errors.UNAUTHORIZED({ message: "User not authenticated." });
    }

    const decision = await buildAiAj().protect(context.request, {
      userId: context.user.id,
    });

    if (decision.isDenied()) {
      const reason = decision.reason;

      if (reason?.isSensitiveInfo?.()) {
        throw errors.BAD_REQUEST({
          message:
            "Sensitive information detected. Please remove PII (e.g., credit card number, phone number, email etc).",
        });
      }

      if (reason?.isRateLimit?.()) {
        throw errors.RATE_LIMITED({
          message: "You have been rate limited.",
        });
      }

      if (reason?.isBot?.()) {
        throw errors.FORBIDDEN({
          message: "Automated traffic detected.",
        });
      }

      if (reason?.isShield?.()) {
        throw errors.FORBIDDEN({
          message: "Request blocked by security policy (WAF).",
        });
      }

      throw errors.FORBIDDEN({
        message: "Request blocked.",
      });
    }

    return next();
  });
