import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { config } from "@/config";
import Web3ModalProvider from "@/context";
import { cookieToInitialState } from "wagmi";
import "dotenv/config";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Oracles fit",
  description:
    "An incentive mechanism for people to lose weight using onchain accountability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className={rajdhani.className}>
        <Web3ModalProvider initialState={initialState}>
          {children}
        </Web3ModalProvider>
      </body>
    </html>
  );
}
