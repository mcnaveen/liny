import NextAuth from "next-auth";

import { authOptions } from "@/lib/auth";

/**
 * @swagger
 * /api/auth/csrf:
 *   get:
 *     description: Get the csrf token and send a POST request to `/api/auth/email` for magic link, or `/api/auth/google` for google login, after successful login check `/api/users/me` below to get the token, which can be used to authenticate the further requests.
 *     tags:
 *      - Authentication
 *     responses:
 *       200:
 *         description: csrf token
 *
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
