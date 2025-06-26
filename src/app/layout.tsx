import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ConfirmDialogProvider } from "@/hooks/use-confirm-dialog";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from '@/components/ui/sonner'
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppHeader } from "@/components/app/app-header";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import localFont from 'next/font/local'
export const proximaNovaExtraCondensed = localFont({
  src: [
    { path: '../../public/fonts/ProximaNovaExCn-Light.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/ProximaNovaExCn-LightIt.woff2', weight: '300', style: 'italic' },
    { path: '../../public/fonts/ProximaNovaExCn-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/ProximaNovaExCn-RegularIt.woff2', weight: '400', style: 'italic' },
    { path: '../../public/fonts/ProximaNovaExCn-Semibold.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/ProximaNovaExCn-SemiboldIt.woff2', weight: '600', style: 'italic' },
    { path: '../../public/fonts/ProximaNovaExCn-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/ProximaNovaExCn-BoldIt.woff2', weight: '700', style: 'italic' },
    { path: '../../public/fonts/ProximaNovaExCn-Black.woff2', weight: '900', style: 'normal' },
    { path: '../../public/fonts/ProximaNovaExCn-BlackIt.woff2', weight: '900', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-proxima',
})

export const metadata: Metadata = {
  authors: [{ name: "Mounir Remache", url: "https://remachemounir.com" }],
  title: {
    default: "Website Builder",
    template: "%s | Website Builder",
  },
  description: "Build a React/NextJS website builder for a coding challenge",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${proximaNovaExtraCondensed.variable} antialiased inset-0 min-h-dvh`}
      >

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider defaultOpen={defaultOpen}>
            <ConfirmDialogProvider>

              <div className="flex h-dvh w-full overflow-hidden">

                <AppSidebar />

                <div className="flex flex-col flex-1 overflow-hidden">

                  <AppHeader title="Builder" />

                  <div className="flex-1 overflow-hidden">

                    {children}

                    <Toaster richColors />

                  </div>

                </div>
              </div>

            </ConfirmDialogProvider>
          </SidebarProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
