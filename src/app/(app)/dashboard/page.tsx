/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { WelcomeAssistant } from "@/components/dashboard/welcome-assistant";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentChallenges } from "@/components/dashboard/recent-challenges";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowUpRight, Crown, Bot, Check, Clock, Code, ExternalLink, Flame, Star, Trophy, Users } from "lucide-react";
import Image from "next/image";
import { AiAssistantModal } from "@/components/ai-assistant-modal";

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeAssistant");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem("hasSeenWelcomeAssistant", "true");
    }
    
    toast({
        title: "Dashboard loaded!",
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
    setAiModalOpen(true);
  }

  return (
    <>
      <WelcomeAssistant isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      <AiAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />

       <div className="space-y-8">
            <div className="animate-fade-in-up">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome back, <span className="gradient-text">John!</span></h1>
                        <p className="text-xl text-muted-foreground">Ready to level up your backend skills today?</p>
                    </div>
                    <div className="mt-4 lg:mt-0 flex items-center space-x-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-400" id="todayXP">+125</div>
                            <div className="text-sm text-muted-foreground">XP Today</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary" id="weeklyGoal">4/7</div>
                            <div className="text-sm text-muted-foreground">Weekly Goal</div>
                        </div>
                    </div>
                </div>
            </div>

            <StatsCards />

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="glass-effect animate-slide-in-left">
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle className="text-2xl">Continue Learning</CardTitle>
                            <Button variant="ghost" size="icon">
                                <ExternalLink className="h-5 w-5" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                             <div className="bg-card/50 rounded-xl p-6 border border-border/50">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Build a REST API with Authentication</h3>
                                        <p className="text-muted-foreground mb-3">Create a secure Node.js API with JWT authentication, user registration, and protected routes.</p>
                                        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                                            <Badge variant="secondary">Medium</Badge>
                                            <Badge variant="outline">Node.js</Badge>
                                            <Badge variant="outline">JWT</Badge>
                                            <Badge variant="outline">Express</Badge>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-primary">75%</div>
                                        <div className="text-sm text-muted-foreground">Complete</div>
                                    </div>
                                </div>
                                
                                <div className="w-full bg-border rounded-full h-2.5 mb-4">
                                    <div className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full" style={{width: '75%'}}></div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                        <span><Clock className="inline mr-1 h-4 w-4" /> 2h 30m left</span>
                                        <span><Check className="inline mr-1 h-4 w-4" /> 6/8 tasks</span>
                                    </div>
                                    <Button onClick={handleContinueChallenge} className="btn-primary-gradient">
                                        Continue
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <RecentChallenges />
                </div>

                <div className="space-y-8">
                    <Card className="glass-effect animate-slide-in-right">
                      <CardHeader>
                        <CardTitle className="text-xl">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                                <div className="w-8 h-8 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                                    <Check className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Completed "API Security"</p>
                                    <p className="text-sm text-muted-foreground">+50 XP • 2 hours ago</p>
                                </div>
                            </div>
                            
                             <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                                <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                                    <Trophy className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Earned "API Master" badge</p>
                                    <p className="text-sm text-muted-foreground">Achievement unlocked • 1 day ago</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                                <div className="w-8 h-8 bg-secondary/20 text-secondary rounded-full flex items-center justify-center">
                                    <Code className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">Started "Microservices"</p>
                                    <p className="text-sm text-muted-foreground">New challenge • 2 days ago</p>
                                </div>
                            </div>
                            
                             <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                                <div className="w-8 h-8 bg-accent/20 text-accent rounded-full flex items-center justify-center">
                                    <Flame className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">7-day coding streak!</p>
                                    <p className="text-sm text-muted-foreground">Keep it up! • 3 days ago</p>
                                </div>
                            </div>
                      </CardContent>
                    </Card>

                     <Card className="glass-effect animate-slide-in-right">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">Latest Achievements</CardTitle>
                            <Button variant="ghost" size="icon">
                                <ExternalLink className="h-5 w-5" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <Trophy className="mx-auto mb-2 text-yellow-400 h-10 w-10"/>
                                <p className="text-xs font-medium">Security Expert</p>
                            </div>
                            <div>
                                <Trophy className="mx-auto mb-2 text-yellow-400 h-10 w-10"/>
                                <p className="text-xs font-medium">DB Master</p>
                            </div>
                            <div>
                                <Trophy className="mx-auto mb-2 text-yellow-400 h-10 w-10"/>
                                <p className="text-xs font-medium">Speed Demon</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-effect animate-slide-in-right">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">Weekly Leaderboard</CardTitle>
                                <Button variant="ghost" size="icon">
                                    <Crown className="text-yellow-400" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                             <div className="flex items-center space-x-3 p-2 rounded-lg">
                                <p className="font-bold w-6 text-center">1</p>
                                <Image src="https://picsum.photos/seed/leader1/40/40" alt="Alex Chen" width={40} height={40} className="rounded-full" data-ai-hint="user avatar" />
                                <div className="flex-1">
                                    <p className="font-medium">Alex Chen</p>
                                    <p className="text-sm text-muted-foreground">2,450 XP</p>
                                </div>
                                <Crown className="text-yellow-400" />
                            </div>
                            
                            <div className="flex items-center space-x-3 p-2 rounded-lg">
                                <p className="font-bold w-6 text-center">2</p>
                                 <Image src="https://picsum.photos/seed/leader2/40/40" alt="Sarah Kim" width={40} height={40} className="rounded-full" data-ai-hint="user avatar" />
                                <div className="flex-1">
                                    <p className="font-medium">Sarah Kim</p>
                                    <p className="text-sm text-muted-foreground">2,180 XP</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-2 rounded-lg bg-primary/10 border border-primary/30">
                                <p className="font-bold w-6 text-center">3</p>
                                <Image src="https://picsum.photos/seed/user/40/40" alt="You" width={40} height={40} className="rounded-full" data-ai-hint="user avatar" />
                                <div className="flex-1">
                                    <p className="font-medium text-primary">You</p>
                                    <p className="text-sm text-muted-foreground">1,950 XP</p>
                                </div>
                                <ArrowUpRight className="text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass-effect animate-float">
                        <CardHeader className="flex-row items-center space-x-3 space-y-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                                <Bot className="text-white"/>
                            </div>
                            <div>
                                <CardTitle className="text-lg">AI Mentor</CardTitle>
                                <p className="text-sm text-muted-foreground">Online</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="glass-effect rounded-xl p-4">
                                <p className="text-sm">💡 <strong>Tip of the day:</strong> When building APIs, always implement proper error handling and logging. It'll save you hours of debugging later!</p>
                            </div>
                            <Button onClick={handleAskAI} variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white transition-all">
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
