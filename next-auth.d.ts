import { DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      provider: string;
      isInstanceAdmin: boolean;
    } & DefaultSession["user"];
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    username: string;
    provider: string;
    isInstanceAdmin: boolean;
  }
}
