
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Header } from "@/components/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AIMentorFab } from "@/components/ai-mentor-fab";
import { useAuth } from "@/hooks/use-auth";
import Loading from "../loading";
import { usePathname } from 'next/navigation';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Don't show the main layout for the full-screen challenge page
  if (pathname.startsWith('/challenges/')) {
    return <>{children}</>;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </SidebarInset>
      <AIMentorFab />
    </SidebarProvider>
  );
}
