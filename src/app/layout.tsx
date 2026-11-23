import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
import RoleSwitcherBar from "@/components/navigation/RoleSwitcherBar";
import DesktopSidebar from "@/components/navigation/DesktopSidebar";
import MobileDock from "@/components/navigation/MobileDock";

export const metadata: Metadata = {
  title: "Ustad AI | Nasra Academic Platform",
  description: "Curriculum-grounded Pakistani Board (BSEK Karachi & AKU-EB) academic intelligence platform for Class 9 and 10 students and teachers.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
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
                {children}
              </main>
            </div>
            <MobileDock />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
