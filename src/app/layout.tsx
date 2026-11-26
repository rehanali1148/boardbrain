import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import RoleSwitcherBar from "@/components/navigation/RoleSwitcherBar";
import DesktopSidebar from "@/components/navigation/DesktopSidebar";
import MobileDock from "@/components/navigation/MobileDock";
import RoleGuard from "@/components/navigation/RoleGuard";

export const metadata: Metadata = {
  title: "BoardBrain | Your Board Exam AI Guru - BSEK & AKU-EB",
  description: "BoardBrain: syllabus-based Pakistani Board (BSEK Karachi & AKU-EB) academic intelligence platform and AI Guru for Class 9 & 10 students and teachers.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/boardbrain-icon.png",
    apple: "/boardbrain-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-brand-emerald selection:text-slate-950">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <RoleSwitcherBar />
            <div className="flex flex-1 w-full max-w-7xl mx-auto">
              <DesktopSidebar />
              <main className="flex-1 w-full min-w-0 pb-20 md:pb-8 p-4 md:p-6 overflow-x-hidden">
                <RoleGuard>{children}</RoleGuard>
              </main>
            </div>
            <MobileDock />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
