import type {
  User as NextAuthUser,
  NextAuthOptions,
  Session,
  DefaultUser,
} from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { JWT } from "next-auth/jwt";

import { db } from "@/lib/db";

declare module "next-auth" {
  interface User extends DefaultUser {
    username?: string;
    isInstanceAdmin?: boolean;
  }
}

interface NextAuthUserWithStringId extends NextAuthUser {
  id: string;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db) as any,
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name,
          username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
        } as NextAuthUserWithStringId;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      checks: ["none"],
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email || "";
        token.username = user.username || "";
        token.isInstanceAdmin =
          (
            await db.user.findUnique({
              where: { id: user.id },
              select: { isInstanceAdmin: true },
            })
          )?.isInstanceAdmin || false;
      }
      if (account) {
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.username = token.username as string;
      session.user.email = token.email as string;
      session.user.provider = token.provider as string;
      session.user.isInstanceAdmin = token.isInstanceAdmin as boolean;

      return session;
    },
  },
  events: {
    createUser: async (event) => {
      const isSelfHosted = process.env.SELFHOSTED === "true";

      if (isSelfHosted) {
        // check if any user has isInstanceAdmin set to true
        const isInstanceAdminExists = await db.user.findFirst({
          where: {
            isInstanceAdmin: true,
          },
        });

        if (!isInstanceAdminExists) {
          await db.user.update({
            where: {
              id: event?.user.id!,
            },
            data: {
              name: event?.user.name!,
              username: event?.user.username || event?.user.name,
              isInstanceAdmin: true,
            },
          });
        }
      }
    },
  },
};
