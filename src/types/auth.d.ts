import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string; // Made optional
    } & DefaultSession["user"];
    idToken?: string; // Made optional
    accessToken?: string;
    // Made optional
    expiresAt?: number;
    backendToken?: string; // Made optional
  }

  interface User extends DefaultUser {
    id?: string; // Made optional
    accessToken?: string;
    backendToken?: null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    idToken?: string; // Made optional
    accessToken?: string; // Made optional
    expiresAt?: number; // Made optional
    sub?: string; // Made optional
  }
}
