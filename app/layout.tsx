import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Art-Dental-Labor | Premium Zahntechnik",
  description: "Ihr Partner fuer digitale und analoge Zahntechnik. DSGVO-konformer Upload fuer Intraoralscans und Patientendaten.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
