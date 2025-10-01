
"use client";

import {
  LayoutDashboard,
  Code,
  TestTube,
  Bot,
  BrainCircuit,
  Lightbulb,
  FileCode,
  User,
  Settings,
  HelpCircle,
  Film,
  Waypoints,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

const mainNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/challenges", icon: Code, label: "Challenges" },
  { href: "/video-lab", icon: Film, label: "Video Lab"},
  { href: "/system-design", icon: Waypoints, label: "System Design" },
  { href: "/playground", icon: BrainCircuit, label: "Code Editor" },
];

const aiToolsNavItems = [
  { href: "/ai-assistant", icon: Bot, label: "AI Assistant" },
  { href: "/ai-code-reviewer", icon: FileCode, label: "AI Code Review" },
  { href: "/project-ideas", label: "Project Ideas", icon: Lightbulb },
  { href: "/tech-advisor", label: "Tech Advisor", icon: BrainCircuit },
];

const userNavItems = [
  { href: "#", icon: User, label: "Profile" },
  { href: "#", icon: Settings, label: "Settings" },
  { href: "#", icon: HelpCircle, label: "Help & Support" },
];

const NavHeader = ({ children }: { children: React.ReactNode }) => (
  <h4 className="px-4 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
    {children}
  </h4>
);

export function MainNav() {
  const pathname = usePathname();

  const renderNavItems = (items: typeof mainNavItems) => {
    return items.map((item) => {
      const isActive = pathname.startsWith(item.href) && item.href !== '#';
      return (
        <Link
          key={`${item.label}-${item.href}`}
          href={item.href}
          className={cn(
            "flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors",
            "hover:bg-muted/50",
            isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.label}</span>
        </Link>
      );
    });
  }

  return (
    <div className="flex h-full flex-col">
       <div className="flex items-center gap-3 p-4 px-4 pb-6">
        <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
                <Code className="text-white text-lg" />
            </div>
            <span className="text-xl font-bold gradient-text">BackendMentorAI</span>
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <nav className="space-y-1">
            {renderNavItems(mainNavItems)}
          </nav>

          <Separator />

          <div>
            <NavHeader>AI Tools</NavHeader>
            <nav className="space-y-1 mt-2">
                {renderNavItems(aiToolsNavItems as any)}
            </nav>
          </div>

          <Separator />
          
          <div>
            <NavHeader>Profile</NavHeader>
            <nav className="space-y-1 mt-2">
                {renderNavItems(userNavItems as any)}
            </nav>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
