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

const KeyMomentSchema = z.object({
    timestamp: z.string().describe('The timestamp of the key moment in MM:SS format.'),
    description: z.string().describe('A brief, one-sentence description of what happens at this moment.')
});

const SummarizeVideoContentOutputSchema = z.object({
  summary: z.string().describe('A detailed, well-structured summary of the video content in Markdown format. The summary should be easy to read, broken into sections with headings, and include bullet points for key takeaways.'),
  keyMoments: z.array(KeyMomentSchema).describe('An array of 3-5 key moments from the video with timestamps and descriptions.')
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
  prompt: `You are an expert technical writer and educator. Your task is to create a high-quality, structured summary of a technical video based on its title and description, and identify key moments.

The summary should be formatted in Markdown and include:
- A brief introduction explaining the video's main topic.
- Key concepts broken down with clear headings.
- Bullet points highlighting important takeaways, tips, or best practices.
- A concluding paragraph that synthesizes the main points.

Also, identify 3-5 key, timestamped moments from the video that a learner would find most useful for quick navigation.

Video Title: {{{title}}}
Video Description/Transcript:
{{{description}}}

Generate the summary and key moments now.
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
