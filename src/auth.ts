// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           prompt: "select_account",
//           access_type: "offline",
//           response_type: "code",
//           scope: "openid email profile",
//         },
//       },
//     }),
//   ],
//    secret: process.env.AUTH_SECRET,
//   callbacks: {
//     async jwt({ token, account }) {
//       // Only add tokens on initial sign-in
//       if (account) {
//         return {
//           ...token,
//           accessToken: account.access_token,
//           idToken: account.id_token,
//           backendToken: null, // Initialize backend token as null
//         };
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       // Only add tokens to session if they exist
//       if (token.accessToken) {
//         session.accessToken = token.accessToken;
//         session.idToken = token.idToken;
//         session.backendToken = token.idToken;
//       }
//       return session;
//     },
//   },
// });

// import NextAuth from "next-auth";
// import Google from "next-auth/providers/google";

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       authorization: {
//         params: {
//           prompt: "select_account",
//           access_type: "offline",
//           response_type: "code",
//           scope: "openid email profile",
//         },
//       },
//     }),
//   ],
//   secret: process.env.AUTH_SECRET,
//   trustHost: true, // Important for production
//   cookies: {
//     sessionToken: {
//       // name: `__Secure-next-auth.session-token`,
//       options: {
//         httpOnly: true,
//         sameSite: "lax",
//         path: "/",
//         secure: process.env.NODE_ENV === "production",

//         domain: ".docpoc.app"
//       },
//     },
//   },
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         return {
//           ...token,
//           accessToken: account.access_token,
//           idToken: account.id_token,
//           backendToken: null,
//         };
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token.accessToken) {
//         session.accessToken = token.accessToken;
//         session.idToken = token.idToken;
//         session.backendToken = token.idToken;
//       }
//       return session;
//     },
//   },
// });

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async jwt({ token, account }: { token: any; account: any }) {
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.backendToken = null;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
        session.idToken = token.idToken;
        session.backendToken = token.idToken;
      }
      return session;
    },
  },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production" ? ".docpoc.app" : undefined,
      },
    },
  },
};

// export default NextAuth(authOptions);
