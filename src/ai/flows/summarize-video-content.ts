'use server';

/**
 * @fileOverview Provides AI-powered summaries for video content.
 *
 * - summarizeVideoContent - A function that generates a summary for a given video.
 * - SummarizeVideoContentInput - The input type for the summarizeVideoContent function.
 * - SummarizeVideoContentOutput - The return type for the summarizeVideoContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeVideoContentInputSchema = z.object({
  title: z
    .string()
    .describe('The title of the video.'),
  description: z
    .string()
    .describe('The description or transcript of the video.'),
});
export type SummarizeVideoContentInput = z.infer<typeof SummarizeVideoContentInputSchema>;

const SummarizeVideoContentOutputSchema = z.object({
  summary: z.string().describe('A detailed, well-structured summary of the video content in Markdown format. The summary should be easy to read, broken into sections with headings, and include bullet points for key takeaways.'),
});
export type SummarizeVideoContentOutput = z.infer<typeof SummarizeVideoContentOutputSchema>;

export async function summarizeVideoContent(
  input: SummarizeVideoContentInput
): Promise<SummarizeVideoContentOutput> {
  return summarizeVideoContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeVideoContentPrompt',
  input: {schema: SummarizeVideoContentInputSchema},
  output: {schema: SummarizeVideoContentOutputSchema},
  prompt: `You are an expert technical writer and educator. Your task is to create a high-quality, structured summary of a technical video based on its title and description.

The summary should be formatted in Markdown and include:
- A brief introduction explaining the video's main topic.
- Key concepts broken down with clear headings.
- Bullet points highlighting important takeaways, tips, or best practices.
- A concluding paragraph that synthesizes the main points.

Make the summary easy to digest and valuable for someone who wants to quickly understand the video's core content.

Video Title: {{{title}}}
Video Description/Transcript:
{{{description}}}

Generate the summary now.
`,
});

const summarizeVideoContentFlow = ai.defineFlow(
  {
    name: 'summarizeVideoContentFlow',
    inputSchema: SummarizeVideoContentInputSchema,
    outputSchema: SummarizeVideoContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
