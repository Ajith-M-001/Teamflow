//middleware.ts

import arcjet, { detectBot, createMiddleware } from "@arcjet/next";
import {
  getKindeServerSession,
  withAuth,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { NextMiddleware, NextRequest, NextResponse } from "next/server";

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
  const anyReq = req as {
    nextUrl: NextRequest["nextUrl"];
    kindeAuth?: { token?: any; user?: any };
  };
  const url = req.nextUrl;
  const orgCode =
    anyReq.kindeAuth?.user?.org_code ||
    anyReq.kindeAuth?.token?.org_code ||
    anyReq.kindeAuth?.user?.claims?.org_code;

  if (
    url.pathname.startsWith("/workspace") &&
    !url.pathname.includes(orgCode || "")
  ) {
    url.pathname = `/workspace/${orgCode}`;
    return NextResponse.redirect(url);
  }
}

export default createMiddleware(
  aj,
  withAuth(existingMiddleware, {
    publicPaths: ["/", "/api/uploadthing"],
  }) as NextMiddleware
);

export const config = {
  // The matcher prevents the middleware executing on static assets and the
  // /api/hello API route because you already installed Arcjet directly
  matcher: ["/((?!_next/static|_next/image|favicon.ico|rpc).*)"],
};
