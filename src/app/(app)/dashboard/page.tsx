"use client";

import { useState, useEffect } from "react";
import { Overview } from "@/components/dashboard/overview";
import { RecentChallenges } from "@/components/dashboard/recent-challenges";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { AiAnalyticsSummary } from "@/components/dashboard/ai-analytics-summary";
import Preloader from "@/components/preloader";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for the preloader effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 14000); // The animation is quite long

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
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