"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { analyticsData } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"


export function Overview() {
  return (
    <Card className="col-span-1 lg:col-span-2 glass-effect">
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={{}} className="min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={analyticsData.weeklyActivity}>
              <XAxis
                dataKey="day"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent
                  className="glass-effect"
                  labelKey="challenges"
                  indicator="dot"
                  formatter={(value, name) => (
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">{name === 'challenges' && 'Challenges Completed'}</span>
                      <span>{value}</span>
                    </div>
                  )}
                />}
              />
              <Bar dataKey="challenges" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
