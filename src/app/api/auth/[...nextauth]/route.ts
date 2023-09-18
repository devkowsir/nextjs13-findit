import NextAuth from "next-auth";
import { authOpions } from "@/lib/auth";

const handler = NextAuth(authOpions);

export { handler as GET, handler as POST };
