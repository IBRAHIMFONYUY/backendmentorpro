"use client"

import { useEffect, useState } from "react"
import { summarizeLearningAnalytics, type SummarizeLearningAnalyticsOutput } from "@/ai/flows/summarize-learning-analytics"
import { analyticsData } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { Bot } from "lucide-react"

export function AiAnalyticsSummary() {
  const [summary, setSummary] = useState<SummarizeLearningAnalyticsOutput | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSummary() {
      setIsLoading(true)
      try {
        const result = await summarizeLearningAnalytics({ analyticsData: analyticsData.rawSummary })
        setSummary(result)
      } catch (error) {
        console.error("Failed to fetch AI summary:", error)
        // Optionally set an error state to show in the UI
      }
      setIsLoading(false)
    }
    fetchSummary()
  }, [])

  return (
    <Card className="glass-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          AI Mentor Insights
        </CardTitle>
        <CardDescription>
          Your personalized progress summary and recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : summary ? (
          <div>
            <p className="text-foreground">{summary.summary}</p>
          </div>
        ) : (
          <p className="text-muted-foreground">Could not load AI summary.</p>
        )}
      </CardContent>
    </Card>
  )
}
