import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/shared/navbar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fontSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
});

const fontSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "MajstorFix - Најди мајстор",
  description: "Платформа за објавување и наддавање на поправки и реновирања",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="mk"
      suppressHydrationWarning
      className={`${fontSerif.variable} ${fontSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="bg-warm-glow fixed inset-0 pointer-events-none" />
          <div className="bg-geo-pattern fixed inset-0 pointer-events-none" />
          <div className="bg-noise fixed inset-0 pointer-events-none" />
          <Navbar />
          <main className="flex-1 relative">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
