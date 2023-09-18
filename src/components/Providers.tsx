"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface ProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

const Providers = ({ children, session }: ProviderProps) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>{children}</SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;
