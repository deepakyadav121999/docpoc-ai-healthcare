import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
  callbacks: {
    async jwt({ token, account }) {
      // Only add tokens on initial sign-in
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          idToken: account.id_token,
          backendToken: null, // Initialize backend token as null
        };
      }
      return token;
    },
    async session({ session, token }) {
      // Only add tokens to session if they exist
      if (token.accessToken) {
        session.accessToken = token.accessToken;
        session.idToken = token.idToken;
        session.backendToken = token.idToken;
      }
      return session;
    },
  },
});
