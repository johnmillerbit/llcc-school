import { DefaultSession, DefaultUser } from "next-auth";

// Extend the default User type
declare module "next-auth" {
  interface User extends DefaultUser {
    username: string;
  }

  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}