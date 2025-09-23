"use client";

import {
  LayoutDashboard,
  Code,
  TestTube,
  Bot,
  Route,
  Users,
  Trophy,
  ChartLine,
  Plus,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/challenges", icon: Code, label: "Challenges" },
  { href: "/playground", icon: TestTube, label: "Playground" },
  { href: "/debugger", icon: Bot, label: "AI Debugger" },
  { href: "/#learning-path", icon: Route, label: "Learning Path" },
  { href: "/#community", icon: Users, label: "Community" },
  { href: "/#achievements", icon: Trophy, label: "Achievements" },
  { href: "/#analytics", icon: ChartLine, label: "Analytics" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col p-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-3 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-dark-border"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="50"
              cy="50"
            />
            <circle
              className="text-accent-blue"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="50"
              cy="50"
              strokeDasharray="276.46"
              strokeDashoffset="105.05" // 276.46 * (1 - 0.62)
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-white">15</div>
              <div className="text-xs text-gray-400">Level</div>
            </div>
          </div>
        </div>
        <div className="text-sm text-gray-400">Senior Backend Dev</div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-white">Progress to Level 16</span>
          <span className="text-accent-blue font-semibold">62%</span>
        </div>
        <div className="w-full bg-dark-border rounded-full h-2">
          <div className="xp-bar rounded-full" style={{ width: '62%' }}></div>
        </div>
        <div className="text-xs text-gray-400 text-center">250 XP to next level</div>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href.split('#')[0]);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                "hover:bg-dark-surface",
                isActive ? "bg-accent-blue/20 text-accent-blue font-medium" : "text-gray-300"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Quick Actions</h4>
        <Button className="w-full justify-center gap-2 btn-primary">
          <Plus />
          <span>New Challenge</span>
        </Button>
        <Button variant="outline" className="w-full justify-center gap-2 border-accent-green text-accent-green hover:bg-accent-green hover:text-white">
          Continue Learning
        </Button>
      </div>
    </div>
  );
}
