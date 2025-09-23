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
import { ArrowUpRight, Crown, Bot, Check, Clock, Code, ExternalLink, Flame, Star, Trophy, Users, CheckCircle, BrainCircuit } from "lucide-react";
import Image from "next/image";
import { AiAssistantModal } from "@/components/ai-assistant-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Overview } from "@/components/dashboard/overview";
import { AiAnalyticsSummary } from "@/components/dashboard/ai-analytics-summary";

export default function DashboardPage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [continueModalOpen, setContinueModalOpen] = useState(false);
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    // We want to show this only on the first visit.
    if (!localStorage.getItem("hasSeenWelcomeAssistant")) {
      setShowWelcome(true);
      localStorage.setItem("hasSeenWelcomeAssistant", "true");
    }
  }, []);

  const handleContinueChallenge = () => {
    setContinueModalOpen(false);
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
      
      {/* Continue Learning Modal */}
      <Dialog open={continueModalOpen} onOpenChange={setContinueModalOpen}>
        <DialogContent className="glass-effect max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3"><BrainCircuit/> Continue: Build a REST API</DialogTitle>
            <DialogDescription>You're 75% complete with this challenge. Ready to finish it?</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
              <p>This challenge focuses on creating a secure Node.js API with JWT authentication, user registration, and protected routes. You have completed 6 out of 8 tasks.</p>
              <div className="space-y-2">
                  <h4 className="font-semibold">Remaining Tasks:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Implement refresh token rotation.</li>
                      <li>Add comprehensive integration tests.</li>
                  </ul>
              </div>
              <Separator />
               <div className="flex justify-end gap-4">
                  <Button variant="ghost" onClick={() => setContinueModalOpen(false)}>Review Later</Button>
                  <Button onClick={handleContinueChallenge} className="btn-primary-gradient">
                    Let's Go!
                  </Button>
               </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Achievements Modal */}
      <Dialog open={achievementsModalOpen} onOpenChange={setAchievementsModalOpen}>
        <DialogContent className="glass-effect">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-3"><Trophy/> All Achievements</DialogTitle>
                <DialogDescription>A collection of all your earned badges and milestones.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-6 py-4 text-center">
                 <div className="space-y-2">
                    <Trophy className="mx-auto text-yellow-400 h-12 w-12"/>
                    <p className="text-sm font-medium">Security Expert</p>
                    <p className="text-xs text-muted-foreground">Completed 5 security challenges.</p>
                </div>
                <div className="space-y-2">
                    <Trophy className="mx-auto text-yellow-400 h-12 w-12"/>
                    <p className="text-sm font-medium">DB Master</p>
                    <p className="text-xs text-muted-foreground">Mastered SQL and NoSQL challenges.</p>
                </div>
                <div className="space-y-2">
                    <Trophy className="mx-auto text-yellow-400 h-12 w-12"/>
                    <p className="text-sm font-medium">Speed Demon</p>
                    <p className="text-xs text-muted-foreground">Solved 3 challenges under 10 minutes.</p>
                </div>
                 <div className="space-y-2 opacity-50">
                    <Trophy className="mx-auto h-12 w-12"/>
                    <p className="text-sm font-medium">Microservice Maestro</p>
                     <p className="text-xs text-muted-foreground">Deploy a full microservice architecture.</p>
                </div>
                 <div className="space-y-2 opacity-50">
                    <Trophy className="mx-auto h-12 w-12"/>
                    <p className="text-sm font-medium">10-Day Streak</p>
                    <p className="text-xs text-muted-foreground">Code for 10 days in a row.</p>
                </div>
                 <div className="space-y-2 opacity-50">
                    <Trophy className="mx-auto h-12 w-12"/>
                    <p className="text-sm font-medium">Community Helper</p>
                    <p className="text-xs text-muted-foreground">Help 5 other developers.</p>
                </div>
            </div>
        </DialogContent>
      </Dialog>


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
                    <div className="grid md:grid-cols-2 gap-8">
                      <AiAnalyticsSummary />
                      <Overview />
                    </div>

                    <RecentChallenges />
                </div>

                <div className="space-y-8">
                    <Card className="glass-effect animate-slide-in-right card-hover">
                      <CardHeader>
                        <CardTitle className="text-xl">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50">
                                <div className="w-8 h-8 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4" />
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

                     <Card className="glass-effect animate-slide-in-right card-hover" onClick={() => setAchievementsModalOpen(true)}>
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

                    <Card className="glass-effect animate-slide-in-right card-hover">
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
