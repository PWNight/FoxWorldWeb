import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "FoxWorld",
  description:
    "Сайт Minecraft проекта FoxWorld",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="http://localhost:3000/icon.png" />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-regular scroll-smooth`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"  
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="sm:container mx-auto w-[85vw] h-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}

