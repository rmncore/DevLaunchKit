import type { Metadata } from "next";
import { ThemeProvider, ToastProvider } from "@devlaunchkit/ui";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchKit — Enterprise SaaS Foundation",
  description: "Next.js 15, React 19, Tailwind CSS v4 monorepo template.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider defaultTheme="system">
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
