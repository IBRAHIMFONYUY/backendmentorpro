import { Badge } from "@/components/ui/badge"
import { Star, Users } from "lucide-react"

export function RecentChallenges() {
  const challenges = [
    {
      title: "Microservices Architecture",
      description: "Design and implement a microservices system with Docker",
      difficulty: "Hard",
      tags: ["Docker", "System Design"],
      xp: "+200",
      attempts: "1.2k",
      rating: "4.8",
    },
    {
      title: "GraphQL API Development",
      description: "Build a flexible GraphQL API with subscriptions",
      difficulty: "Medium",
      tags: ["GraphQL", "API"],
      xp: "+150",
      attempts: "856",
      rating: "4.6",
    },
     {
      title: "Real-time Chat Application",
      description: "Create a real-time chat with WebSockets and Redis",
      difficulty: "Medium",
      tags: ["WebSockets", "Real-time"],
      xp: "+175",
      attempts: "2.1k",
      rating: "4.9",
    },
     {
      title: "Database Optimization",
      description: "Optimize queries and implement caching strategies",
      difficulty: "Easy",
      tags: ["SQL", "Databases"],
      xp: "+100",
      attempts: "3.4k",
      rating: "4.7",
    },
  ]

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Hard":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Easy":
        return "default"
      default:
        return "outline"
    }
  }

  return (
     <div className="glass-effect rounded-2xl p-6 animate-fade-in-up card-hover">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommended for You</h2>
            <div className="flex space-x-1 bg-card p-1 rounded-lg">
                <button className="px-3 py-1 rounded-md text-sm font-medium bg-background text-foreground">All</button>
                <button className="px-3 py-1 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground">Backend</button>
                <button className="px-3 py-1 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground">Fullstack</button>
            </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            {challenges.map((challenge, index) => (
                <div key={index} className="bg-card/50 p-4 rounded-lg border border-border/50 hover:border-primary transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h4 className="font-bold mb-1">{challenge.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{challenge.description}</p>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant={getDifficultyBadge(challenge.difficulty)}>{challenge.difficulty}</Badge>
                                {challenge.tags.map(tag => (
                                    <Badge key={tag} variant="outline">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="text-yellow-400 font-bold text-sm">{challenge.xp} XP</div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                        <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {challenge.attempts} attempts</span>
                        <span className="flex items-center gap-1"><Star className="h-4 w-4" /> {challenge.rating}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
