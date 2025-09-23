import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Trophy, Code, Clock, Users, ArrowUp } from "lucide-react"

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-left">
        <Card className="glass-effect card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl flex items-center justify-center">
                    <Code className="text-white text-xl" />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">47</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm font-medium">Challenges Solved</div>
                <p className="text-xs text-green-400 flex items-center">
                   <ArrowUp className="h-4 w-4 mr-1" />
                    +3 this week
                </p>
            </CardContent>
        </Card>
        
        <Card className="glass-effect card-hover">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <div className="w-12 h-12 bg-gradient-to-r from-accent-green to-accent-blue rounded-xl flex items-center justify-center">
                    <Clock className="text-white text-xl" />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">23h</p>
                    <p className="text-xs text-muted-foreground">This Month</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm font-medium">Coding Time</div>
                <p className="text-xs text-green-400 flex items-center">
                   <ArrowUp className="h-4 w-4 mr-1" />
                    +5h from last month
                </p>
            </CardContent>
        </Card>
        
        <Card className="glass-effect card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <div className="w-12 h-12 bg-gradient-to-r from-accent-purple to-accent-red rounded-xl flex items-center justify-center">
                    <Trophy className="text-white text-xl" />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Earned</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm font-medium">Achievements</div>
                 <p className="text-xs text-green-400 flex items-center">
                   <Star className="h-4 w-4 mr-1" />
                    2 new this week
                </p>
            </CardContent>
        </Card>
        
        <Card className="glass-effect card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <div className="w-12 h-12 bg-gradient-to-r from-accent-red to-accent-yellow rounded-xl flex items-center justify-center">
                    <Users className="text-white text-xl" />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">#247</p>
                    <p className="text-xs text-muted-foreground">Global</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm font-medium">Leaderboard Rank</div>
                 <p className="text-xs text-green-400 flex items-center">
                   <ArrowUp className="h-4 w-4 mr-1" />
                    +15 positions
                </p>
            </CardContent>
        </Card>
    </div>
  )
}
