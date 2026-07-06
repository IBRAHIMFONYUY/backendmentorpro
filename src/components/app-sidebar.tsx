
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code,
  Compass,
  FileCode,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
  Plus,
  Route,
  Trophy,
  Users,
  Wrench,
  LineChart,
  Settings,
  User,
  LifeBuoy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Icons } from "./icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const mainMenuItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/challenges", icon: Code, label: "Challenges" },
  { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { href: "/collaboration", icon: Users, label: "Community" },
];

const aiToolsMenuItems = [
  { href: "/assistant", icon: MessageSquare, label: "AI Assistant" },
  { href: "/code-review", icon: FileCode, label: "AI Code Review" },
  { href: "/project-ideas", icon: Lightbulb, label: "Project Ideas" },
  { href: "/tech-stack", icon: Wrench, label: "Tech Advisor" },
];

const userMenuItems = [
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/settings", icon: Settings, label: "Settings" },
    { href: "/help", icon: LifeBuoy, label: "Help & Support"}
]

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="border-r bg-sidebar text-sidebar-foreground glass-effect"
    >
      <SidebarHeader className="p-4 flex items-center justify-center">
        <Link href="/dashboard" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <Icons.logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold ml-2 group-data-[collapsible=icon]:hidden">
            Backend Mentor
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2 space-y-4">
        <SidebarMenu>
          {mainMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium"
                    >
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div>
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2 group-data-[collapsible=icon]:text-center">
            AI Tools
          </h4>
          <SidebarMenu>
            {aiToolsMenuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        className="flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium"
                      >
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
         <SidebarMenu>
          {userMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      className="flex items-center space-x-3 px-3 py-2.5 rounded-lg font-medium"
                    >
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="p-4 rounded-lg bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 group-data-[collapsible=icon]:p-2">
          <div className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
            Upgrade to Pro
          </div>
          <p className="text-xs text-muted-foreground mt-1 group-data-[collapsible=icon]:hidden">
            Unlock all features and get unlimited access to our AI mentor.
          </p>
          <Button
            size="sm"
            className="w-full mt-3 group-data-[collapsible=icon]:hidden"
          >
            Upgrade
          </Button>
          <Button size="icon" className="w-full hidden group-data-[collapsible=icon]:block">
            <Plus />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
