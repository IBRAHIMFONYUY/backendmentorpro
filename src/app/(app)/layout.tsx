"use client";

import { useState } from 'react';
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Bell, Flame, Menu, Search, Star, CheckCircle, Code, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type Notification = {
  id: number;
  icon: React.ReactNode;
  text: string;
  time: string;
  details: string;
}

const notifications: Notification[] = [
    { id: 1, icon: <CheckCircle className="text-green-500" />, text: "You completed the 'Two Sum' challenge.", time: "5m ago", details: "Congratulations on completing the 'Two Sum' challenge! You earned 150 XP. Your solution was efficient and well-structured. Keep up the great work!" },
    { id: 2, icon: <Star className="text-yellow-500" />, text: "You earned 150 XP.", time: "1h ago", details: "You've been awarded 150 XP for your recent activity and progress. This brings you closer to the next level. Keep pushing your limits!" },
    { id: 3, icon: <Code className="text-blue-500" />, text: "A new 'API Rate Limiter' challenge is available.", time: "3h ago", details: "A new medium-difficulty challenge, 'API Rate Limiter', has been added. This is a great opportunity to practice your system design skills. Give it a try!" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  return (
    <>
      <div className="flex min-h-screen w-full bg-background">
        <aside className="fixed left-0 top-0 h-full w-64 glass-effect z-40 hidden lg:block">
          <MainNav />
        </aside>

        <div className="lg:pl-64 flex flex-col w-full">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <div className="lg:hidden">
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 glass-effect border-r-0">
                    <SheetTitle>
                      <span className="sr-only">Menu</span>
                    </SheetTitle>
                    <MainNav />
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="hidden md:flex items-center w-full max-w-md">
              <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input type="search" placeholder="Search challenges..." className="pl-10" />
              </div>
            </div>

            <div className="flex-1 flex justify-end items-center gap-4">
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-md">
                      <Flame className="text-white" />
                  </div>
                  <span className="font-bold text-lg text-orange-400">7</span>
              </div>
              <div className="flex items-center gap-2">
                  <Star className="text-yellow-400" />
                  <span className="font-bold text-lg">3,750</span>
                  <span className="text-sm text-muted-foreground">XP</span>
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5 text-primary" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-white">{notifications.length}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4">
                      <h4 className="font-medium text-foreground">Notifications</h4>
                  </div>
                  <Separator />
                  <div className="p-2 space-y-1">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer" onClick={() => setSelectedNotification(notification)}>
                          {notification.icon}
                          <div className="flex-1">
                              <p className="text-sm text-foreground">{notification.text}</p>
                              <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <UserNav />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {children}
          </main>
        </div>
      </div>
      
      {selectedNotification && (
        <Dialog open={!!selectedNotification} onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}>
            <DialogContent className="glass-effect">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        {selectedNotification.icon}
                        Notification Details
                    </DialogTitle>
                    <DialogDescription className="text-left pt-2">
                        {selectedNotification.time}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <p>{selectedNotification.details}</p>
                </div>
            </DialogContent>
        </Dialog>
      )}
    </>
  );
}
