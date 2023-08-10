"use client";
import { SessionProvider } from "next-auth/react";

type AuthProviderTypes = {
  children: React.ReactNode;
  session: any;
};

export default function Provider({ children, session }: AuthProviderTypes) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
