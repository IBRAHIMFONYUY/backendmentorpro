import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Trophy, Code, Clock, Users, ArrowUp, Star } from "lucide-react"

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-left">
        <div className="glass-effect rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl flex items-center justify-center">
                    <Code className="text-white text-xl" />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">47</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                </div>
            </div>
            <div className="text-sm text-gray-300">Challenges Solved</div>
            <div className="mt-2 flex items-center text-accent-green text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+3 this week</span>
            </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 card-hover">
             <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-gradient-to-r from-accent-green to-accent-blue rounded-xl flex items-center justify-center">
                    <Clock className="text-white text-xl" />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">23h</p>
                    <p className="text-sm text-muted-foreground">This Month</p>
                </div>
            </div>
            <div className="text-sm text-gray-300">Coding Time</div>
            <div className="mt-2 flex items-center text-accent-green text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+5h from last month</span>
            </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-gradient-to-r from-accent-purple to-accent-red rounded-xl flex items-center justify-center">
                    <Trophy className="text-white text-xl" />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Earned</p>
                </div>
            </div>
            <div className="text-sm text-gray-300">Achievements</div>
            <div className="mt-2 flex items-center text-accent-green text-sm">
                <Star className="h-4 w-4 mr-1" />
                <span>2 new this week</span>
            </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-6 card-hover">
            <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-gradient-to-r from-accent-red to-accent-yellow rounded-xl flex items-center justify-center">
                    <Users className="text-white text-xl" />
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">#247</p>
                    <p className="text-sm text-muted-foreground">Global</p>
                </div>
            </div>
            <div className="text-sm text-gray-300">Leaderboard Rank</div>
            <div className="mt-2 flex items-center text-accent-green text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>+15 positions</span>
            </div>
        </div>
    </div>
  )
}
