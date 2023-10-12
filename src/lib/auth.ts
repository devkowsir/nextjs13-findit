import prisma from "@/lib/database/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { nanoid } from "nanoid";
import { AuthOptions, getServerSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOpions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      name: "github",
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      name: "google",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;
      const user = await prisma.user.findFirst({
        where: { id: token.sub },
      });
      let username = user?.username;

      if (!user?.username || user.username.length > 8) username = nanoid(8);
      await prisma.user.update({
        where: { id: token.sub },
        data: { username },
      });

      return {
        id: token.sub,
        name: token.name,
        username: username,
        email: token.email,
        image: token.picture,
      };
    },
    async session({ token, session }) {
      return { ...session, user: token };
    },
  },
};

export const getAuthSession = () => getServerSession(authOpions);
