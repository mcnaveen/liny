import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const availableProviders = authOptions.providers.map(
    (provider) => provider.id,
  );

  return NextResponse.json(availableProviders);
}
