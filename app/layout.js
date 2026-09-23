import { Geist } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/layout/SessionProvider";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "TradeLify",
  description: "Your one-stop shop for everything",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={geist.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}