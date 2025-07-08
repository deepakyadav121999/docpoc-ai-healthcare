// import { DefaultSession, DefaultUser } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id?: string; // Made optional
//     } & DefaultSession["user"];
//     idToken?: string; // Made optional
//     accessToken?: string;
//     // Made optional
//     expiresAt?: number;
//     backendToken?: string; // Made optional
//   }

//   interface User extends DefaultUser {
//     id?: string; // Made optional
//     accessToken?: string;
//     backendToken?: null;
//   }
// }

// declare module "@auth/core/jwt" {
//   interface JWT {
//     idToken?: string; // Made optional
//     accessToken?: string; // Made optional
//     expiresAt?: number; // Made optional
//     sub?: string; // Made optional
//   }
// }

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    idToken?: string;
    backendToken?: string | null;
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    idToken?: string;
    backendToken?: string | null;
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
