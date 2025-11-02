//middleware.ts

import arcjet, { detectBot, createMiddleware } from "@arcjet/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY as string,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
        "CATEGORY:MONITOR",
        "CATEGORY:WEBHOOK",
      ],
    }),
  ],
});

async function existingMiddleware(req: NextRequest) {
  const { getClaim } = getKindeServerSession();
  const orgCode = await getClaim("org_code");
  const url = req.nextUrl;
  if (
    url.pathname.startsWith("/workspace") &&
    !url.pathname.includes(orgCode?.value || "")
  ) {
    url.pathname = `/workspace/${orgCode?.value}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export default createMiddleware(aj, existingMiddleware);

export const config = {
  // The matcher prevents the middleware executing on static assets and the
  // /api/hello API route because you already installed Arcjet directly
  matcher: ["/((?!_next/static|_next/image|favicon.ico|rpc).*)"],
};
