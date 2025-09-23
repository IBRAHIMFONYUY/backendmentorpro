"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Trophy, Code, Clock, Users, ArrowUp, Star } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Overview } from "./overview";

type StatModalContent = {
  title: string;
  icon: React.ReactNode;
  description: string;
  details: React.ReactNode;
};

export function StatsCards() {
  const [modalContent, setModalContent] = useState<StatModalContent | null>(null);
  
  const stats: StatModalContent[] = [
    {
      title: "Challenges Solved",
      icon: <Code className="text-primary" />,
      description: "Total number of coding challenges you have successfully completed.",
      details: (
        <div>
          <p className="text-4xl font-bold">47</p>
          <p className="text-sm text-green-400 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              +3 this week
          </p>
          <p className="mt-4 text-muted-foreground">You are doing great! Your problem-solving skills are improving with every challenge.</p>
        </div>
      )
    },
    {
      title: "Coding Time",
      icon: <Clock className="text-secondary" />,
      description: "Total time spent actively coding in the platform.",
      details: (
        <div>
          <p className="text-4xl font-bold">23h</p>
          <p className="text-sm text-green-400 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              +5h from last month
          </p>
           <p className="mt-4 text-muted-foreground">Consistent practice is key. Keep investing time to sharpen your skills.</p>
           <div className="h-64 mt-4 -ml-4">
            <Overview />
           </div>
        </div>
      )
    },
    {
      title: "Achievements",
      icon: <Trophy className="text-accent" />,
      description: "Badges and milestones you have earned.",
      details: (
        <div>
          <p className="text-4xl font-bold">12</p>
          <p className="text-sm text-green-400 flex items-center">
            <Star className="h-4 w-4 mr-1" />
            2 new this week
          </p>
          <p className="mt-4 text-muted-foreground">You've unlocked several achievements, showcasing your growing expertise.</p>
        </div>
      )
    },
    {
      title: "Leaderboard Rank",
      icon: <Users className="text-yellow-400" />,
      description: "Your current position on the weekly leaderboard.",
      details: (
        <div>
          <p className="text-4xl font-bold">#247</p>
          <p className="text-sm text-green-400 flex items-center">
              <ArrowUp className="h-4 w-4 mr-1" />
              +15 positions
          </p>
          <p className="mt-4 text-muted-foreground">You are climbing the ranks! Compete with others and aim for the top.</p>
        </div>
      )
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-left">
          <Card className="glass-effect card-hover cursor-pointer" onClick={() => setModalContent(stats[0])}>
              <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Challenges Solved</CardTitle>
                  <Code className="text-primary" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-green-400 flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      +3 this week
                  </p>
              </CardContent>
          </Card>
          
          <Card className="glass-effect card-hover cursor-pointer" onClick={() => setModalContent(stats[1])}>
               <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Coding Time</CardTitle>
                  <Clock className="text-secondary" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">23h</div>
                   <p className="text-xs text-green-400 flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      +5h from last month
                  </p>
              </CardContent>
          </Card>
          
          <Card className="glass-effect card-hover cursor-pointer" onClick={() => setModalContent(stats[2])}>
              <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Achievements</CardTitle>
                  <Trophy className="text-accent" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">12</div>
                   <p className="text-xs text-green-400 flex items-center">
                     <Star className="h-4 w-4 mr-1" />
                      2 new this week
                  </p>
              </CardContent>
          </Card>
          
          <Card className="glass-effect card-hover cursor-pointer" onClick={() => setModalContent(stats[3])}>
              <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Leaderboard Rank</CardTitle>
                  <Users className="text-yellow-400" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">#247</div>
                   <p className="text-xs text-green-400 flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1" />
                      +15 positions
                  </p>
              </CardContent>
          </Card>
      </div>

      {modalContent && (
        <Dialog open={!!modalContent} onOpenChange={(isOpen) => !isOpen && setModalContent(null)}>
          <DialogContent className="glass-effect">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl">
                {modalContent.icon}
                {modalContent.title}
              </DialogTitle>
              <DialogDescription className="pt-2">
                {modalContent.description}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">{modalContent.details}</div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
