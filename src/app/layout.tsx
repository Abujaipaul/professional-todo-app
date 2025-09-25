
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import styles from "./layout.module.css";
import Providers from "@/components/Providers";
import AuthButton from "@/components/AuthButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Professional Todo App",
  description: "A comprehensive Todo application built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <Providers>
          <header className={styles.header}>
            <Link href="/" className={styles.logo}>TodoApp</Link>
            <AuthButton />
          </header>
          <main className={styles.container}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}