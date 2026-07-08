import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Genesis I. Polotan | Portfolio",
  description:
    "Professional portfolio of Genesis I. Polotan — Computer Engineering, Cybersecurity, Automotive CAN/AGL, AI Edge Intelligence, and Embedded Systems."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#020403] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
