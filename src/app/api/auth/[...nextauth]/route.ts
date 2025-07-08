// import { handlers } from "@/auth";

// export const { GET, POST } = handlers;

import { authOptions } from "@/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
