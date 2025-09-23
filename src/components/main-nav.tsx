"use client";

import {
  LayoutDashboard,
  Code,
  TestTube,
  Cpu,
  Bot,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/challenges",
    icon: Code,
    label: "Challenges",
  },
  {
    href: "/debugger",
    icon: Bot,
    label: "AI Debugger",
  },
  {
    href: "/playground",
    icon: TestTube,
    label: "API Playground",
  },
];

export function MainNav({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-center gap-2 px-2 py-4">
      <Link
        href="/"
        className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground"
      >
        <Cpu className="h-7 w-7 transition-all" />
        <span className="sr-only">BackendMentorAI</span>
      </Link>
      <div className="flex-grow w-full border-t border-border my-2"></div>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Tooltip key={item.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex h-12 items-center justify-center rounded-lg transition-colors w-full",
                  "hover:bg-accent hover:text-accent-foreground",
                   isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="flex items-center gap-4">
                {item.label}
              </TooltipContent>
            )}
          </Tooltip>
        );
      })}
    </nav>
  );
}
