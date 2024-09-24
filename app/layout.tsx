import type { Metadata, Viewport } from "next";

import "./globals.css";

import { Toaster } from "sonner";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { ScreenSize } from "@/components/common/screensize";
import { Navbar } from "@/components/common/navbar";

import { Provider } from "./provider";
import SessionProvider from "./session";

export const metadata: Metadata = {
  title: "Liny",
  description: "An Open Source Alternative to Canny",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`flex flex-col min-h-screen bg-gray-50/80 dark:bg-black`}
      >
        <SessionProvider session={session}>
          <Provider themeProps={{ attribute: "class", defaultTheme: "dark" }}>
            <Navbar />
            <Toaster position="bottom-left" />
            <main className="flex-grow">{children}</main>
            {process.env.NODE_ENV === "development" && <ScreenSize />}
          </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
