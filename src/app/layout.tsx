import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Pinnacle Home Services – CRM",
  description: "Small business lead and sales dashboard — demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
