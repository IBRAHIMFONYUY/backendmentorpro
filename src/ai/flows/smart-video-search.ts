'use server';

/**
 * @fileOverview An AI-powered flow for intelligently searching for educational videos.
 *
 * - smartVideoSearch - A function that performs a smart search for videos.
 * - SmartVideoSearchInput - The input type for the smartVideoSearch function.
 * - SmartVideoSearchOutput - The return type for the smartVideoSearch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { videos } from '@/lib/video-data';

const SmartVideoSearchInputSchema = z.object({
  query: z.string().describe('The user\'s natural language search query for a video.'),
});
export type SmartVideoSearchInput = z.infer<typeof SmartVideoSearchInputSchema>;

const VideoSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    channel: z.string(),
    youtubeId: z.string(),
    thumbnailUrl: z.string(),
});

const SmartVideoSearchOutputSchema = z.object({
  videos: z.array(VideoSchema).describe('An array of relevant videos found from the search.'),
});
export type SmartVideoSearchOutput = z.infer<typeof SmartVideoSearchOutputSchema>;

// This is a tool that simulates calling the YouTube API
const searchYouTube = ai.defineTool(
  {
    name: 'searchYouTube',
    description: 'Searches for educational programming videos. Returns videos relevant to the query.',
    inputSchema: z.object({
      query: z.string().describe('The search query for videos.'),
    }),
    outputSchema: z.object({
        videos: z.array(VideoSchema)
    })
  },
  async ({ query }) => {
    // In a real app, this would call the YouTube API.
    // For this prototype, we'll filter our local data.
    const lowerCaseQuery = query.toLowerCase();
    const results = videos.filter(video => 
        video.title.toLowerCase().includes(lowerCaseQuery) ||
        video.description.toLowerCase().includes(lowerCaseQuery) ||
        video.channel.toLowerCase().includes(lowerCaseQuery)
    );
    return { videos: results.slice(0, 10) }; // Return top 10 results
  }
);


export async function smartVideoSearch(
  input: SmartVideoSearchInput
): Promise<SmartVideoSearchOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a helpful assistant that helps users find educational videos. Your goal is to understand the user's query and use the available tool to find the most relevant videos.
      User query: ${input.query}`,
    tools: [searchYouTube],
  });

  const toolResponse = llmResponse.toolRequest?.output;

  if (toolResponse) {
    return toolResponse as SmartVideoSearchOutput;
  }
  
  // Fallback if the tool doesn't respond as expected
  return { videos: [] };
}
