import { NextRequest, NextResponse } from "next/server";

import rateLimitMiddleware from "@/lib/rate-limit";

import { getMetaTags } from "./utils";

export const runtime = "edge";

const rateLimitedGET = rateLimitMiddleware(async (req: NextRequest) => {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    throw new Error("URL parameter is required");
  }

  const metatags = await getMetaTags(url);

  return NextResponse.json(metatags, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
});

export async function GET(req: NextRequest) {
  return rateLimitedGET(req);
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
