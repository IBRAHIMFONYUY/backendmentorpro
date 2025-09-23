"use client";

import { useState, useEffect } from "react";
import { WelcomeAssistant } from "@/components/dashboard/welcome-assistant";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentChallenges } from "@/components/dashboard/recent-challenges";
import { Overview } from "@/components/dashboard/overview";
import { AiAnalyticsSummary } from "@/components/dashboard/ai-analytics-summary";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpRight, Crown, Bot, Check, Clock, Code, ExternalLink, Fire, Plus, Star, Trophy, Users } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeAssistant");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem("hasSeenWelcomeAssistant", "true");
    }
    
    toast({
        title: "Dashboard loaded successfully!",
        description: "Welcome back, ready to level up your skills?",
    })
  }, [toast]);

  const handleContinueChallenge = () => {
    toast({
        title: 'Loading challenge environment...',
        description: 'Please wait a moment.',
    });
     setTimeout(() => {
        toast({
            title: 'Challenge environment ready!',
            description: 'Good luck!',
        });
    }, 1500);
  }
  
  const handleAskAI = () => {
    toast({
        title: 'Opening AI Mentor...',
        description: 'Your personal assistant is ready to help.',
    });
  }

  return (
    <>
      <WelcomeAssistant isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
       <div className="space-y-8">
            {/* Welcome Section */}
            <div className="animate-fade-in-up">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome back, <span className="gradient-text">John!</span></h1>
                        <p className="text-xl text-gray-300">Ready to level up your backend skills today?</p>
                    </div>
                    <div className="mt-4 lg:mt-0 flex items-center space-x-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-accent-green" id="todayXP">+125</div>
                            <div className="text-sm text-gray-400">XP Today</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-accent-blue" id="weeklyGoal">4/7</div>
                            <div className="text-sm text-gray-400">Weekly Goal</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <StatsCards />

            {/* Main Dashboard Content */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Continue Learning Section */}
                    <Card className="glass-effect animate-slide-in-left">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-2xl">Continue Learning</CardTitle>
                                <Button variant="ghost" size="icon">
                                    <ExternalLink className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="challenge-card rounded-xl p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Build a REST API with Authentication</h3>
                                        <p className="text-gray-400 mb-3">Create a secure Node.js API with JWT authentication, user registration, and protected routes.</p>
                                        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                                            <Badge className="challenge-difficulty-medium">Medium</Badge>
                                            <Badge variant="outline">Node.js</Badge>
                                            <Badge variant="outline">JWT</Badge>
                                            <Badge variant="outline">Express</Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-accent-blue">75%</div>
                                        <div className="text-sm text-gray-400">Complete</div>
                                    </div>
                                </div>
                                
                                <div className="w-full bg-dark-border rounded-full h-2 mb-4">
                                    <div className="bg-gradient-to-r from-accent-blue to-accent-purple h-2 rounded-full" style={{width: '75%'}}></div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                                        <span><Clock className="inline mr-1 h-4 w-4" /> 2h 30m left</span>
                                        <span><Check className="inline mr-1 h-4 w-4" /> 6/8 tasks</span>
                                    </div>
                                    <Button onClick={handleContinueChallenge} className="btn-primary">
                                        Continue
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommended Challenges */}
                    <RecentChallenges />
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Recent Activity */}
                    <Card className="glass-effect animate-slide-in-right">
                      <CardHeader>
                        <CardTitle className="text-xl">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                            <div className="activity-item flex items-start space-x-3 p-3 rounded-lg">
                                <div className="w-8 h-8 bg-accent-green/20 text-accent-green rounded-full flex items-center justify-center">
                                    <Check className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">Completed "API Security"</div>
                                    <div className="text-sm text-muted-foreground">+50 XP • 2 hours ago</div>
                                </div>
                            </div>
                            
                             <div className="activity-item flex items-start space-x-3 p-3 rounded-lg">
                                <div className="w-8 h-8 bg-accent-blue/20 text-accent-blue rounded-full flex items-center justify-center">
                                    <Trophy className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">Earned "API Master" badge</div>
                                    <div className="text-sm text-muted-foreground">Achievement unlocked • 1 day ago</div>
                                </div>
                            </div>
                            
                            <div className="activity-item flex items-start space-x-3 p-3 rounded-lg">
                                <div className="w-8 h-8 bg-accent-purple/20 text-accent-purple rounded-full flex items-center justify-center">
                                    <Code className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">Started "Microservices"</div>
                                    <div className="text-sm text-muted-foreground">New challenge • 2 days ago</div>
                                </div>
                            </div>
                            
                             <div className="activity-item flex items-start space-x-3 p-3 rounded-lg">
                                <div className="w-8 h-8 bg-accent-red/20 text-accent-red rounded-full flex items-center justify-center">
                                    <Fire className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">7-day coding streak!</div>
                                    <div className="text-sm text-muted-foreground">Keep it up! • 3 days ago</div>
                                </div>
                            </div>
                      </CardContent>
                    </Card>

                    {/* Achievements */}
                     <Card className="glass-effect animate-bounce-in">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">Latest Achievements</CardTitle>
                            <Button variant="ghost" size="icon">
                                <ExternalLink className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="achievement-badge mx-auto mb-2">
                                    <Trophy className="text-white text-xl"/>
                                </div>
                                <div className="text-xs font-medium">Security Expert</div>
                            </div>
                            <div className="text-center">
                                <div className="achievement-badge mx-auto mb-2">
                                    <Trophy className="text-white text-xl"/>
                                </div>
                                <div className="text-xs font-medium">DB Master</div>
                            </div>
                            <div className="text-center">
                                <div className="achievement-badge mx-auto mb-2">
                                    <Trophy className="text-white text-xl"/>
                                </div>
                                <div className="text-xs font-medium">Speed Demon</div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Leaderboard */}
                    <Card className="glass-effect animate-scale-in">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">Weekly Leaderboard</CardTitle>
                                <Button variant="ghost" size="icon">
                                    <Crown className="text-accent-yellow" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                             <div className="flex items-center space-x-3 p-2 rounded-lg">
                                <div className="leaderboard-rank">1</div>
                                <Image src="https://picsum.photos/seed/leader1/40/40" alt="Alex Chen" width={40} height={40} className="rounded-full" data-ai-hint="user avatar" />
                                <div className="flex-1">
                                    <div className="font-medium">Alex Chen</div>
                                    <div className="text-sm text-gray-400">2,450 XP</div>
                                </div>
                                <Crown className="text-accent-yellow" />
                            </div>
                            
                            <div className="flex items-center space-x-3 p-2 rounded-lg">
                                <div className="leaderboard-rank">2</div>
                                 <Image src="https://picsum.photos/seed/leader2/40/40" alt="Sarah Kim" width={40} height={40} className="rounded-full" data-ai-hint="user avatar" />
                                <div className="flex-1">
                                    <div className="font-medium">Sarah Kim</div>
                                    <div className="text-sm text-gray-400">2,180 XP</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-2 rounded-lg bg-accent-blue/10 border border-accent-blue/30">
                                <div className="leaderboard-rank">3</div>
                                <Image src="https://picsum.photos/seed/user/40/40" alt="You" width={40} height={40} className="rounded-full" data-ai-hint="user avatar" />
                                <div className="flex-1">
                                    <div className="font-medium text-accent-blue">You</div>
                                    <div className="text-sm text-gray-400">1,950 XP</div>
                                </div>
                                <ArrowUpRight className="text-accent-green" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* AI Mentor */}
                    <Card className="glass-effect animate-float">
                        <CardHeader className="flex-row items-center space-x-3 space-y-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full flex items-center justify-center">
                                <Bot className="text-white"/>
                            </div>
                            <div>
                                <CardTitle className="text-lg">AI Mentor</CardTitle>
                                <p className="text-sm text-gray-400">Online</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="glass-effect rounded-xl p-4">
                                <p className="text-sm">💡 <strong>Tip of the day:</strong> When building APIs, always implement proper error handling and logging. It'll save you hours of debugging later!</p>
                            </div>
                            <Button onClick={handleAskAI} variant="outline" className="w-full border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white transition-all">
                                Ask AI Mentor
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </>
  );
}
