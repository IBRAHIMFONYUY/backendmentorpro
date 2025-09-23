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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

const mainNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/challenges", icon: Code, label: "Challenges" },
  { href: "/playground", icon: TestTube, label: "Playground" },
  { href: "/debugger", icon: BrainCircuit, label: "AI Debugger" },
];

const aiToolsNavItems = [
  { href: "/ai-assistant", icon: Bot, label: "AI Assistant" },
  { href: "/ai-code-review", icon: FileCode, label: "AI Code Review" },
  { href: "/project-ideas", icon: Lightbulb, label: "Project Ideas" },
  { href: "/tech-advisor", icon: BrainCircuit, label: "Tech Advisor" },
];

const userNavItems = [
  { href: "/profile", icon: User, label: "Profile" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/support", icon: HelpCircle, label: "Help & Support" },
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
      const isActive = pathname.startsWith(item.href);
      return (
        <Link
          key={item.href}
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
    <div className="flex h-full flex-col p-4">
       <div className="flex items-center gap-3 px-2 pb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center">
            <Code className="text-white text-lg" />
        </div>
        <span className="text-xl font-bold gradient-text">BackendMentorAI</span>
      </div>

      <nav className="flex-grow space-y-1">
        {renderNavItems(mainNavItems)}
      </nav>

      <div className="flex-grow space-y-4">
        <Separator className="my-4" />
        <NavHeader>AI Tools</NavHeader>
        <div className="space-y-1">
            {renderNavItems(aiToolsNavItems)}
        </div>
      </div>
      
      <div className="space-y-4">
        <Separator className="my-4" />
        <NavHeader>Profile</NavHeader>
        <div className="space-y-1">
            {renderNavItems(userNavItems)}
        </div>
      </div>
    </div>
  );
}
