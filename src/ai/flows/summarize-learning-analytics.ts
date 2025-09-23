// Summarize user's learning analytics to identify knowledge gaps and areas for improvement.

'use server';

/**
 * @fileOverview Generates summaries from user learning analytics.
 *
 * - summarizeLearningAnalytics - A function that summarizes learning analytics.
 * - SummarizeLearningAnalyticsInput - The input type for the summarizeLearningAnalytics function.
 * - SummarizeLearningAnalyticsOutput - The return type for the summarizeLearningAnalytics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLearningAnalyticsInputSchema = z.object({
  analyticsData: z
    .string()
    .describe('The user learning analytics data, including progress, scores, and challenge completion status.'),
});
export type SummarizeLearningAnalyticsInput = z.infer<
  typeof SummarizeLearningAnalyticsInputSchema
>;

const SummarizeLearningAnalyticsOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the user learning analytics, highlighting knowledge gaps and areas for improvement.'
    ),
  progress: z
    .string()
    .describe('A short, one-sentence summary of what you have learned.'),
});
export type SummarizeLearningAnalyticsOutput = z.infer<
  typeof SummarizeLearningAnalyticsOutputSchema
>;

export async function summarizeLearningAnalytics(
  input: SummarizeLearningAnalyticsInput
): Promise<SummarizeLearningAnalyticsOutput> {
  return summarizeLearningAnalyticsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLearningAnalyticsPrompt',
  input: {schema: SummarizeLearningAnalyticsInputSchema},
  output: {schema: SummarizeLearningAnalyticsOutputSchema},
  prompt: `You are an AI mentor tasked with summarizing user learning analytics to help them optimize their learning strategy.

  Analyze the following learning analytics data and provide a summary of the user's knowledge gaps and areas for improvement.

  Learning Analytics Data:
  {{analyticsData}}

  Summary:`,
});

const summarizeLearningAnalyticsFlow = ai.defineFlow(
  {
    name: 'summarizeLearningAnalyticsFlow',
    inputSchema: SummarizeLearningAnalyticsInputSchema,
    outputSchema: SummarizeLearningAnalyticsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output!,
      progress: 'Generated a summary of learning analytics to identify areas for improvement.',
    };
  }
);
