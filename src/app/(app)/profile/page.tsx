
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Star, Trophy, Clock, GitCommit, CheckSquare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  // Mock data, replace with actual user data
  const userStats = {
    challengesSolved: 47,
    achievements: 12,
    globalRank: 247,
    codingTime: "128h",
    commits: 342,
    testsPassed: 1234,
    currentStreak: 7,
    longestStreak: 21,
    skills: [
        { name: "Node.js", level: 85 },
        { name: "API Security", level: 70 },
        { name: "Docker", level: 50 },
    ]
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1 font-headline">
          User Profile
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage your account and see your progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="w-24 h-24 mb-4 border-4 border-accent-blue/50">
                <AvatarImage src={user.photoURL ?? ""} />
                <AvatarFallback className="text-4xl">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl">{user.displayName || "User"}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
            </CardHeader>
            <CardContent>
              <Button className="w-full btn-primary">Edit Profile</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Badges</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
                 <div className="text-center" title="Security Expert">
                    <div className="achievement-badge mx-auto mb-2">
                      <ShieldCheck className="text-white text-2xl" />
                    </div>
                  </div>
                   <div className="text-center" title="7-Day Streak">
                    <div className="achievement-badge mx-auto mb-2">
                      <Clock className="text-white text-2xl" />
                    </div>
                  </div>
                   <div className="text-center" title="Top 10% Rank">
                    <div className="achievement-badge mx-auto mb-2">
                      <Trophy className="text-white text-2xl" />
                    </div>
                  </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" defaultValue={user.displayName || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user.email || ""} disabled />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>A summary of your activity and achievements.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div className="glass-effect p-4 rounded-lg">
                    <Trophy className="mx-auto h-8 w-8 text-accent-yellow mb-2"/>
                    <p className="text-2xl font-bold">{userStats.challengesSolved}</p>
                    <p className="text-muted-foreground text-sm">Challenges Solved</p>
                </div>
                 <div className="glass-effect p-4 rounded-lg">
                    <Star className="mx-auto h-8 w-8 text-accent-blue mb-2"/>
                    <p className="text-2xl font-bold">{userStats.achievements}</p>
                    <p className="text-muted-foreground text-sm">Achievements</p>
                </div>
                 <div className="glass-effect p-4 rounded-lg">
                    <ShieldCheck className="mx-auto h-8 w-8 text-accent-green mb-2"/>
                    <p className="text-2xl font-bold">#{userStats.globalRank}</p>
                    <p className="text-muted-foreground text-sm">Global Rank</p>
                </div>
                <div className="glass-effect p-4 rounded-lg">
                    <Clock className="mx-auto h-8 w-8 text-accent-purple mb-2"/>
                    <p className="text-2xl font-bold">{userStats.codingTime}</p>
                    <p className="text-muted-foreground text-sm">Total Time</p>
                </div>
                 <div className="glass-effect p-4 rounded-lg">
                    <GitCommit className="mx-auto h-8 w-8 text-accent-red mb-2"/>
                    <p className="text-2xl font-bold">{userStats.commits}</p>
                    <p className="text-muted-foreground text-sm">Commits</p>
                </div>
                 <div className="glass-effect p-4 rounded-lg">
                    <CheckSquare className="mx-auto h-8 w-8 text-primary mb-2"/>
                    <p className="text-2xl font-bold">{userStats.testsPassed}</p>
                    <p className="text-muted-foreground text-sm">Tests Passed</p>
                </div>
            </CardContent>
          </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Skill Progress</CardTitle>
                    <CardDescription>Your proficiency in different areas.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {userStats.skills.map(skill => (
                        <div key={skill.name}>
                            <div className="flex justify-between mb-1">
                                <span className="text-base font-medium text-white">{skill.name}</span>
                                <span className="text-sm font-medium text-accent-blue">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
