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
        <link rel="shortcut icon" href="/logo.png" />
        <title>FoxWorld</title>
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-regular antialiased tracking-wide min-h-screen grid grid-rows-[64px,1fr,64px]`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"  
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="mx-auto sm:w-[93vw]">
            {children}
          </main>
          <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}

