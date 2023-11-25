import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import SideNav from "./_components/SideNav";
import NextAuthProvider from "./Context";
import { getServerSession } from "next-auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Twitter Clone",
  description: "This is a Twitter clone",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <div className="container mx-auto flex">
        <NextAuthProvider>
          <SideNav/>
          <div className="min-h-screen flex-grow border-x">
        <TRPCReactProvider  cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
        </div>
        </NextAuthProvider>
        </div>
      </body>
    </html>
  );
}
