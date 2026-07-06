import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const leaderboardData = [
  { rank: 1, name: "Alex Turing", points: 10240, challenges: 52, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
  { rank: 2, name: "Brendan Eich", points: 9870, challenges: 48, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e" },
  { rank: 3, name: "Grace Hopper", points: 9500, challenges: 45, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f" },
  { rank: 4, name: "Linus Torvalds", points: 8800, challenges: 41, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a" },
  { rank: 5, name: "Ada Lovelace", points: 8250, challenges: 39, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b" },
  { rank: 6, name: "Yukihiro Matsumoto", points: 7900, challenges: 35, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c" },
  { rank: 7, name: "John Carmack", points: 7500, challenges: 33, avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g" },
];

const getRankBadge = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return rank;
};

export default function LeaderboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1 font-headline">
          Leaderboard
        </h1>
        <p className="text-lg text-muted-foreground">
          See who's at the top of their game.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>
            The weekly leaderboard of the most active developers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right hidden sm:table-cell">
                  Challenges
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((user) => (
                <TableRow key={user.rank}>
                  <TableCell className="font-bold text-lg">
                    {getRankBadge(user.rank)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {user.points.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right hidden sm:table-cell">
                    {user.challenges}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
