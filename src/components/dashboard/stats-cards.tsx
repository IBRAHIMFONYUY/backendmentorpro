import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Trophy, Code, Clock, Users, ArrowUp, Star } from "lucide-react"

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-left">
        <Card className="glass-effect">
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
        
        <Card className="glass-effect">
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
        
        <Card className="glass-effect">
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
        
        <Card className="glass-effect">
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
  )
}
