import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users } from "lucide-react"

export function RecentChallenges() {
  const challenges = [
    {
      title: "Microservices Architecture",
      description: "Design and implement a microservices system with Docker",
      difficulty: "Hard",
      tags: ["Docker"],
      xp: "+200",
      attempts: "1.2k",
      rating: "4.8",
    },
    {
      title: "GraphQL API Development",
      description: "Build a flexible GraphQL API with subscriptions",
      difficulty: "Medium",
      tags: ["GraphQL"],
      xp: "+150",
      attempts: "856",
      rating: "4.6",
    },
     {
      title: "Real-time Chat Application",
      description: "Create a real-time chat with WebSockets and Redis",
      difficulty: "Medium",
      tags: ["WebSockets"],
      xp: "+175",
      attempts: "2.1k",
      rating: "4.9",
    },
     {
      title: "Database Optimization",
      description: "Optimize queries and implement caching strategies",
      difficulty: "Easy",
      tags: ["SQL"],
      xp: "+100",
      attempts: "3.4k",
      rating: "4.7",
    },
  ]

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case "Hard":
        return "challenge-difficulty-hard"
      case "Medium":
        return "challenge-difficulty-medium"
      case "Easy":
        return "challenge-difficulty-easy"
      default:
        return ""
    }
  }

  return (
     <Card className="glass-effect animate-fade-in-up">
        <CardHeader>
            <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Recommended for You</CardTitle>
                <div className="flex space-x-2">
                    <button className="tab-button active px-4 py-2 rounded-lg font-medium" data-tab="all">All</button>
                    <button className="tab-button px-4 py-2 rounded-lg font-medium" data-tab="backend">Backend</button>
                    <button className="tab-button px-4 py-2 rounded-lg font-medium" data-tab="fullstack">Fullstack</button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
            {challenges.map((challenge, index) => (
                <div key={index} className="challenge-card rounded-xl p-4 cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h4 className="font-bold mb-1">{challenge.title}</h4>
                            <p className="text-sm text-gray-400 mb-2">{challenge.description}</p>
                            <div className="flex space-x-2">
                                <Badge className={`skill-badge ${getDifficultyClass(challenge.difficulty)}`}>{challenge.difficulty}</Badge>
                                {challenge.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="skill-badge">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="text-accent-yellow font-bold">{challenge.xp} XP</div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                        <span><Users className="inline h-4 w-4 mr-1" /> {challenge.attempts} attempts</span>
                        <span><Star className="inline h-4 w-4 mr-1" /> {challenge.rating}</span>
                    </div>
                </div>
            ))}
        </CardContent>
    </Card>
  )
}
