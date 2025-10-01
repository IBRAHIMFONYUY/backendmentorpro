
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

// This tool calls the live YouTube Data API
const searchYouTube = ai.defineTool(
  {
    name: 'searchYouTube',
    description: 'Searches YouTube for educational programming and software development videos. Returns a list of videos relevant to the user\'s query.',
    inputSchema: z.object({
      query: z.string().describe('A targeted, keyword-rich search query for videos.'),
    }),
    outputSchema: z.object({
        videos: z.array(VideoSchema)
    })
  },
  async ({ query }) => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      console.error("YOUTUBE_API_KEY is not set in the environment.");
      throw new Error("Server configuration error: YouTube API key is missing.");
    }
    
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('q', `software development ${query}`); // Focus search on relevant topics
    url.searchParams.append('type', 'video');
    url.searchParams.append('maxResults', '12');
    url.searchParams.append('key', apiKey);

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        const errorData = await response.json();
        console.error("YouTube API Error:", errorData);
        throw new Error(`YouTube API request failed with status ${response.status}`);
      }
      const data = await response.json();
      
      const videos: z.infer<typeof VideoSchema>[] = data.items.map((item: any) => ({
        id: item.id.videoId,
        youtubeId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        channel: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      }));

      return { videos };

    } catch (error) {
      console.error('Failed to fetch from YouTube API:', error);
      // Return an empty array on error to prevent total failure
      return { videos: [] };
    }
  }
);


export async function smartVideoSearch(
  input: SmartVideoSearchInput
): Promise<SmartVideoSearchOutput> {
  const llmResponse = await ai.generate({
    prompt: `You are a helpful assistant that helps users find educational videos about software development. Your goal is to rephrase the user's query into a concise, keyword-focused search query for the YouTube API. For example, if a user asks "show me videos on how to build a REST API in Node.js", a good query would be "Node.js REST API tutorial".
      User query: ${input.query}`,
    tools: [searchYouTube],
    model: 'googleai/gemini-2.5-flash',
  });

  const toolResponse = llmResponse.toolRequest?.output;

  if (toolResponse) {
    return toolResponse as SmartVideoSearchOutput;
  }
  
  // Fallback if the tool doesn't respond as expected
  console.warn("AI did not use the search tool. Returning empty results.");
  return { videos: [] };
}
