"use client";

import { useState } from 'react';
import { cn } from "@/lib/utils";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Flame, Menu, Search, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="fixed left-0 top-0 h-full w-64 glass-effect z-40 hidden lg:block">
        <MainNav />
      </aside>

      <div className="lg:ml-64 flex flex-col w-full">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <div className="lg:hidden">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 glass-effect border-r-0">
                <MainNav />
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="hidden md:flex items-center w-full max-w-md">
            <div className="relative w-full">
                <Input type="search" placeholder="Search challenges..." className="pl-10" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-accent-green to-accent-blue rounded-full flex items-center justify-center">
                    <Flame className="text-white text-sm streak-flame" />
                </div>
                <span className="font-bold text-accent-yellow">7</span>
            </div>
            <div className="flex items-center gap-2">
                <Star className="text-accent-yellow" />
                <span className="font-bold">3,750</span>
                <span className="text-sm text-muted-foreground">XP</span>
            </div>
            
            <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-accent-blue" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-red rounded-full flex items-center justify-center text-xs font-bold text-white">3</span>
            </Button>
            <UserNav />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
