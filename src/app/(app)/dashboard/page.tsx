"use client";

import { useState, useEffect } from "react";
import { Overview } from "@/components/dashboard/overview";
import { RecentChallenges } from "@/components/dashboard/recent-challenges";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AiAnalyticsSummary } from "@/components/dashboard/ai-analytics-summary";
import { WelcomeAssistant } from "@/components/dashboard/welcome-assistant";

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeAssistant");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem("hasSeenWelcomeAssistant", "true");
    }
  }, []);

  return (
    <>
      <WelcomeAssistant isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatsCards />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-5">
        <RecentChallenges />
        <div className="lg:col-span-2 grid gap-4 md:gap-8 auto-rows-max">
          <AiAnalyticsSummary />
          <Overview />
        </div>
      </div>
    </>
  );
}
