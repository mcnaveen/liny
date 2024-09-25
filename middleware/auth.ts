import { getServerSession } from "next-auth";
import { verify } from "jsonwebtoken";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

import { authOptions } from "@/lib/auth";

interface DecodedToken {
  id: string;
  email: string;
  isInstanceAdmin: boolean;
}

export const authenticate = async (
  _req: NextRequest | Request,
): Promise<DecodedToken | null> => {
  // First, try to get the session (works for server-side requests)
  const session = await getServerSession(authOptions);

  if (session?.user) {
    return {
      id: session.user.id,
      email: session.user.email!,
      isInstanceAdmin: session.user.isInstanceAdmin,
    };
  }

  // If no session, check for Authorization header (works for client-side requests)
  const headersList = headers();
  const authHeader =
    headersList.get("authorization") || headersList.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  try {
    const decodedToken = verify(
      token,
      process.env.NEXTAUTH_SECRET!,
    ) as DecodedToken;

    return decodedToken;
  } catch (error) {
    return null;
  }
};
