import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Module Choices",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-white font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headers()}>
          <h1>
            Software in development assume all data is transmitted publicly.
            This includes data that is entered into the website. If you want to
            test the site I recommend using a email from something such as temp
            mail.
          </h1>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
