import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { challenges } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default function ChallengesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Coding Challenges</h1>
        <p className="text-muted-foreground">
          Test your skills with our collection of backend-focused challenges.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{challenge.title}</CardTitle>
                <Badge
                  variant={
                    challenge.difficulty === "Easy"
                      ? "secondary"
                      : challenge.difficulty === "Medium"
                      ? "default"
                      : "destructive"
                  }
                  className="capitalize"
                >
                  {challenge.difficulty}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2 pt-2">
                {challenge.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2">
                {challenge.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/challenges/${challenge.slug}`}>Start Challenge</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
