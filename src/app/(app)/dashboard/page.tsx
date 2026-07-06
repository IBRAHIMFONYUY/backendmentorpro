
"use client";

import Link from "next/link";
import {
  ArrowUp,
  Check,
  Clock,
  Code,
  Crown,
  Database,
  ExternalLink,
  Flame,
  Globe,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Challenge, getChallenges } from "@/services/challenges";


function StatCardSkeleton() {
  return (
    <Card className="glass-effect rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="text-right">
          <Skeleton className="h-7 w-12 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20 mt-2" />
    </Card>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userStats, setUserStats] = useState({
    challengesSolved: 0,
    codingTime: 0,
    achievements: 0,
    leaderboardRank: 0,
    xpToday: 0,
    weeklyGoal: { current: 0, total: 7},
    learningProgress: 0,
  });
  const [recommendedChallenges, setRecommendedChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    let savedStats;
    try {
        savedStats = localStorage.getItem('userStats');
        if (savedStats) {
          setUserStats(JSON.parse(savedStats));
        } else {
            const initialStats = {
                challengesSolved: 0,
                codingTime: 0,
                achievements: 0,
                leaderboardRank: 0,
                xpToday: 0,
                weeklyGoal: { current: 0, total: 7},
                learningProgress: 0,
            };
            setUserStats(initialStats);
            localStorage.setItem('userStats', JSON.stringify(initialStats));
        }
    } catch (error) {
        console.warn("Could not access or parse user stats from local storage:", error);
    }
    
    async function fetchRecommended() {
        try {
            const all = await getChallenges();
            setRecommendedChallenges(all.slice(0, 4));
        } catch (error) {
            console.error("Failed to fetch recommended challenges:", error);
        }
    }
    fetchRecommended();

  }, []);

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "challenge-difficulty-easy";
      case "medium":
      case "intermediate":
        return "challenge-difficulty-medium";
      case "hard":
      case "expert":
        return "challenge-difficulty-hard";
      default:
        return "skill-badge";
    }
  };


const activityFeed = [
  {
    icon: Check,
    iconBg: "bg-accent-green/20 text-accent-green",
    title: 'Completed "API Security"',
    details: "+100 XP • 2 hours ago",
  },
  {
    icon: Trophy,
    iconBg: "bg-accent-blue/20 text-accent-blue",
    title: 'Earned "API Master" badge',
    details: "Achievement unlocked • 1 day ago",
  },
  {
    icon: Code,
    iconBg: "bg-accent-purple/20 text-accent-purple",
    title: 'Started "Microservices"',
    details: "New challenge • 2 days ago",
  },
  {
    icon: Flame,
    iconBg: "bg-accent-red/20 text-accent-red",
    title: "7-day coding streak!",
    details: "Keep it up! • 3 days ago",
  },
];

const achievements = [
  { icon: ShieldCheck, title: "Security Expert" },
  { icon: Database, title: "DB Master" },
  { icon: Rocket, title: "Speed Demon" },
];

const leaderboard = [
  {
    rank: 1,
    name: "Alex Chen",
    xp: "2,450 XP",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a",
    isTop: true,
  },
  {
    rank: 2,
    name: "Sarah Kim",
    xp: "2,180 XP",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
    isTop: false,
  },
  {
    rank: 3,
    name: "You",
    xp: `${userStats.challengesSolved * 100 + userStats.xpToday} XP`,
    avatar: "",
    isCurrentUser: true,
    isTop: false,
  },
];


  return (
    <div className="space-y-8 min-h-screen">
      <div className="animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{user?.displayName || "Developer"}!</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300">
              Ready to level up your backend skills today?
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-green">+{userStats.xpToday}</div>
              <div className="text-sm text-gray-400">XP Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-blue">{userStats.weeklyGoal.current}/{userStats.weeklyGoal.total}</div>
              <div className="text-sm text-gray-400">Weekly Goal</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr animate-slide-in-left">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card className="glass-effect rounded-2xl p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl flex items-center justify-center">
                    <Code className="text-white text-xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{userStats.challengesSolved}</div>
                     <div className="text-sm text-gray-400">Completed</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300">Challenges Solved</p>
                <div className="mt-2 flex items-center text-accent-green text-sm">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  <span>+3 this week</span>
                </div>
            </Card>
             <Card className="glass-effect rounded-2xl p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-green to-accent-blue rounded-xl flex items-center justify-center">
                    <Clock className="text-white text-xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{userStats.codingTime}h</div>
                     <div className="text-sm text-gray-400">This Month</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300">Coding Time</p>
                <div className="mt-2 flex items-center text-accent-green text-sm">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  <span>+5h from last month</span>
                </div>
            </Card>
            <Card className="glass-effect rounded-2xl p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-purple to-accent-red rounded-xl flex items-center justify-center">
                    <Trophy className="text-white text-xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{userStats.achievements}</div>
                     <div className="text-sm text-gray-400">Earned</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300">Achievements</p>
                <div className="mt-2 flex items-center text-accent-green text-sm">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  <span>2 new this week</span>
                </div>
            </Card>
            <Card className="glass-effect rounded-2xl p-6 card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent-red to-accent-yellow rounded-xl flex items-center justify-center">
                    <Globe className="text-white text-xl" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">#{userStats.leaderboardRank}</div>
                     <div className="text-sm text-gray-400">Global</div>
                  </div>
                </div>
                <p className="text-sm text-gray-300">Leaderboard Rank</p>
                <div className="mt-2 flex items-center text-accent-green text-sm">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  <span>+15 positions</span>
                </div>
            </Card>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-effect rounded-2xl p-4 md:p-6 animate-slide-in-left">
            <CardHeader className="p-0 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-2xl font-bold">
                  Continue Learning
                </CardTitle>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/challenges">
                        <ExternalLink className="text-accent-blue hover:text-accent-purple transition-colors" />
                    </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="challenge-card rounded-xl p-4 md:p-6 mb-4">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-xl font-bold mb-2">
                      Build a REST API with Authentication
                    </h3>
                    <p className="text-gray-400 mb-3 max-w-md">
                      Create a secure Node.js API with JWT authentication, user
                      registration, and protected routes.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="skill-badge challenge-difficulty-medium">
                        Medium
                      </span>
                      <span className="skill-badge">Node.js</span>
                      <span className="skill-badge">JWT</span>
                      <span className="skill-badge">Express</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-0 sm:ml-4">
                    <div className="text-3xl font-bold text-accent-blue">
                      {userStats.learningProgress}%
                    </div>
                    <div className="text-sm text-gray-400">Complete</div>
                  </div>
                </div>

                <Progress value={userStats.learningProgress} className="h-2 mb-4" />

                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4 sm:mb-0">
                    <span>
                      <Clock className="inline mr-1 h-4 w-4" /> 2h 30m left
                    </span>
                    <span>
                      <Check className="inline mr-1 h-4 w-4" /> 6/8 tasks
                    </span>
                  </div>
                  <Button className="btn-primary text-white rounded-lg font-medium w-full sm:w-auto" asChild>
                    <Link href="/challenges/jwt-middleware">Continue</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect rounded-2xl p-4 md:p-6 animate-fade-in-up">
            <CardHeader className="p-0 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-2xl font-bold mb-4 sm:mb-0">
                  Recommended for You
                </CardTitle>
                <div className="flex space-x-1 sm:space-x-2 bg-dark-surface p-1 rounded-lg">
                  <Button
                    variant="ghost"
                    className="tab-button active flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium"
                  >
                    All
                  </Button>
                  <Button
                    variant="ghost"
                    className="tab-button flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium"
                  >
                    Backend
                  </Button>
                  <Button
                    variant="ghost"
                    className="tab-button flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium"
                  >
                    Fullstack
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-4">
                {recommendedChallenges.map((challenge, index) => (
                  <Link href={`/challenges/${challenge.id}`} key={challenge.id}>
                    <div
                      className="challenge-card rounded-xl p-4 cursor-pointer h-full"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold mb-1">{challenge.title}</h4>
                          <p className="text-sm text-gray-400 mb-2">
                            {challenge.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span
                              className={`skill-badge ${getDifficultyClass(
                                challenge.difficulty
                              )}`}
                            >
                              {challenge.difficulty}
                            </span>
                            {challenge.tags.map((tag) => (
                              <span key={tag} className="skill-badge">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-accent-yellow font-bold whitespace-nowrap ml-2">
                          +150 XP
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="glass-effect rounded-2xl p-4 md:p-6 animate-slide-in-right">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-bold">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-4">
                {activityFeed.map((item, index) => (
                  <div
                    key={index}
                    className="activity-item flex items-start space-x-3 p-3 rounded-lg"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.iconBg}`}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-400">
                        {item.details}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect rounded-2xl p-4 md:p-6 animate-bounce-in">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  Latest Achievements
                </CardTitle>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/achievements">
                        <ExternalLink className="text-accent-blue hover:text-accent-purple transition-colors" />
                    </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {achievements.map((ach, index) => (
                  <div key={index} className="text-center">
                    <div className="achievement-badge mx-auto mb-2">
                      <ach.icon className="text-white text-2xl" />
                    </div>
                    <div className="text-xs font-medium">{ach.title}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect rounded-2xl p-4 md:p-6 animate-scale-in">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  Weekly Leaderboard
                </CardTitle>
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/leaderboard">
                        <Crown className="text-accent-blue hover:text-accent-purple transition-colors" />
                    </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3">
                {leaderboard.map((leaderboardUser) => (
                  <div
                    key={leaderboardUser.rank}
                    className={`flex items-center space-x-3 p-2 rounded-lg ${
                      leaderboardUser.isCurrentUser
                        ? "bg-accent-blue/10 border border-accent-blue/30"
                        : ""
                    }`}
                  >
                    <div className="leaderboard-rank">{leaderboardUser.rank}</div>
                    <Avatar className="w-8 h-8">
                      {leaderboardUser.avatar && <AvatarImage src={leaderboardUser.avatar} />}
                      <AvatarFallback
                        className={`bg-gradient-to-r ${
                          leaderboardUser.isCurrentUser
                            ? "from-accent-blue to-accent-purple"
                            : "from-accent-yellow to-accent-red"
                        }`}
                      >
                         {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          leaderboardUser.isCurrentUser ? "text-accent-blue" : ""
                        }`}
                      >
                        {leaderboardUser.isCurrentUser ? user?.displayName || 'You' : leaderboardUser.name}
                      </div>
                      <div className="text-sm text-gray-400">{leaderboardUser.xp}</div>
                    </div>
                    {leaderboardUser.isTop ? (
                      <Crown className="text-accent-yellow" />
                    ) : leaderboardUser.isCurrentUser ? (
                      <ArrowUp className="text-accent-green" />
                    ) : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect rounded-2xl p-4 md:p-6 animate-float">
            <CardHeader className="p-0 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full flex items-center justify-center">
                  <MessageSquare className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold">AI Mentor</h3>
                  <div className="text-sm text-gray-400">Online</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="glass-effect rounded-xl p-4 mb-4">
                <p className="text-sm">
                  💡 <strong>Tip of the day:</strong> When building APIs, always
                  implement proper error handling and logging. It&apos;ll save you
                  hours of debugging later!
                </p>
              </div>
               <Button
                variant="outline"
                className="w-full border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white transition-all font-medium"
                asChild
              >
                <Link href="/assistant">Ask AI Mentor</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    