import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Footer } from "@/components/footer";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
          <meta name="yandex-verification" content="c04ce28554a98387" />
          <link rel="shortcut icon" href="/logo.png" />
          <title>FoxWorld</title>
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-regular antialiased tracking-wide min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"  
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <Navbar />
          <main className="w-full pt-16">
            {children}
          </main>
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}

