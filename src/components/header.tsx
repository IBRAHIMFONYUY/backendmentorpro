
"use client";

import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Flame,
  MessageSquare,
  Search,
  Settings,
  Star,
  User,
  LogOut,
  X,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import { Icons } from "./icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";


const initialNotifications = [
    { id: 1, text: 'You unlocked the "API Master" badge!', time: "5 minutes ago", read: false },
    { id: 2, text: 'New challenge available: "Real-time Analytics"', time: "1 hour ago", read: false },
    { id: 3, text: 'Your friend Alex completed a challenge.', time: "3 hours ago", read: true },
]

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
        await logout();
        router.push("/");
    } catch (error) {
        console.error("Failed to log out", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: number) => {
      setNotifications(notifications.map(n => n.id === id ? {...n, read: true} : n));
      toast({
        title: "Notification marked as read.",
      })
  };
  
  const handleClearAll = () => {
      setNotifications([]);
       toast({
        title: "All notifications cleared.",
      })
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-dark-border px-4 sm:px-6 glass-effect">
      <SidebarTrigger className="md:hidden" />

      <div className={cn("flex-1 flex justify-center lg:justify-start", isSearchOpen ? "hidden md:flex" : "flex")}>
        <div className="hidden lg:flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">
                Backend Mentor
            </h1>
            </Link>
        </div>
      </div>

      <div className={cn("flex-1 items-center justify-center", isSearchOpen ? "flex" : "hidden md:flex")}>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search challenges..."
            className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:border-accent-blue focus:outline-none"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-2 sm:space-x-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            {isSearchOpen ? <X className="h-5 w-5"/> : <Search className="h-5 w-5"/>}
        </Button>

        <div className="hidden sm:flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-accent-green to-accent-blue rounded-full flex items-center justify-center">
            <Flame className="text-white h-4 w-4 streak-flame" />
          </div>
          <span className="font-bold text-accent-yellow">7</span>
        </div>
        
        <div className="hidden sm:flex items-center space-x-2">
          <Star className="text-accent-yellow h-5 w-5" />
          <span className="font-bold">3,750</span>
        </div>
      
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-dark-surface">
                    <Bell className="h-5 w-5 text-accent-blue" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-red rounded-full flex items-center justify-center text-xs font-bold">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-effect w-80">
                <DropdownMenuLabel>
                    <div className="flex justify-between items-center">
                        <span>Notifications</span>
                        {notifications.length > 0 && <Button variant="link" size="sm" className="p-0 h-auto" onClick={handleClearAll}>Clear all</Button>}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                        <DropdownMenuItem key={n.id} className={cn("flex items-start gap-3", !n.read && "bg-accent-blue/10")}>
                            <div className="mt-1">
                                {!n.read ? <div className="w-2 h-2 rounded-full bg-accent-blue"/> : <Check className="w-3 h-3 text-muted-foreground"/>}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm leading-snug">{n.text}</p>
                                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                            </div>
                            {!n.read && (
                                <Button variant="ghost" size="sm" className="p-0 h-auto text-accent-blue hover:text-accent-blue" onClick={(e) => {e.stopPropagation(); handleMarkAsRead(n.id);}}>
                                    Mark as read
                                </Button>
                            )}
                        </DropdownMenuItem>
                    )) : (
                        <div className="text-center text-muted-foreground py-4">
                            No new notifications
                        </div>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="hover:bg-dark-surface animate-pulse-glow" asChild>
            <Link href="/assistant">
                <MessageSquare className="h-5 w-5 text-accent-purple" />
            </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-dark-surface transition-colors"
            >
              <Avatar className="w-8 h-8">
                 <AvatarImage src={user?.photoURL ?? undefined} />
                <AvatarFallback className="bg-gradient-to-r from-accent-blue to-accent-purple text-sm font-bold">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block font-medium">{user?.displayName || 'User'}</span>
              <ChevronDown className="h-4 w-4 text-sm hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-effect w-56">
            <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.displayName || 'Welcome'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
