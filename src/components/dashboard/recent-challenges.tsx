import Link from "next/link";
import { challenges } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ArrowUpRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function RecentChallenges() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Recent Challenges</CardTitle>
          <CardDescription>
            You have completed 2 challenges this week.
          </CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/challenges">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Challenge</TableHead>
              <TableHead className="hidden sm:table-cell">Difficulty</TableHead>
              <TableHead className="hidden md:table-cell">Tags</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {challenges.slice(0, 4).map((challenge) => (
              <TableRow key={challenge.id}>
                <TableCell>
                  <div className="font-medium">{challenge.title}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                   <Badge variant={challenge.difficulty === 'Easy' ? 'secondary' : challenge.difficulty === 'Medium' ? 'default' : 'destructive'} className="capitalize">{challenge.difficulty}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex gap-1">
                    {challenge.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {challenge.id === '1' || challenge.id === '2' ? (
                    <Badge variant="default" className="bg-green-600/20 text-green-400 border-green-600/20 hover:bg-green-600/30">Completed</Badge>
                  ) : (
                    <Badge variant="secondary">In Progress</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
