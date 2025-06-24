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

export const metadata: Metadata = {
  title: "NextJS Website Builder by Mounir Remache",
  description: "Build a React website builder for a coding challenge",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
