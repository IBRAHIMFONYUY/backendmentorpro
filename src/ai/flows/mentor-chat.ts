
'use server';

/**
 * @fileOverview A conversational AI chat agent named Rahim.
 *
 * - mentorChat - A function that handles a conversational chat with the AI mentor.
 * - MentorChatInput - The input type for the mentorChat function.
 * - MentorChatOutput - The return type for the mentorChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MentorChatInputSchema = z.object({
  message: z.string().describe("The user's message to the AI mentor."),
  media: z
    .object({
      url: z
        .string()
        .describe(
          "A media file as a data URI that must include a MIME type and use Base64 encoding."
        ),
      contentType: z
        .string()
        .describe("The MIME type of the media file (e.g., 'image/jpeg', 'text/plain')."),
    })
    .optional()
    .describe('Optional: An image or file uploaded by the user.'),
});
export type MentorChatInput = z.infer<typeof MentorChatInputSchema>;

const MentorChatOutputSchema = z.object({
  response: z.string().describe("The AI mentor's response."),
});
export type MentorChatOutput = z.infer<typeof MentorChatOutputSchema>;

export async function mentorChat(input: MentorChatInput): Promise<MentorChatOutput> {
  return mentorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentorChatPrompt',
  input: {schema: MentorChatInputSchema},
  output: {schema: MentorChatOutputSchema},
  prompt: `You are Rahim, a senior developer mentor on the BackendMentorAI platform. Your purpose is to help users across the entire platform.

  Your Persona:
  - You are a friendly, encouraging, patient, and slightly witty senior engineer.
  - You are a MENTOR, not a code generator. Your primary goal is to guide users to the solution, not to give it to them directly.
  - Help users think through problems, understand concepts, and learn best practices.
  - Offer advice and motivation on all software engineering aspects, from coding and debugging to project architecture and career growth.

  Your Behavior:
  - If a user asks for code, gently push back. Instead, ask them questions to help them figure out the answer themselves. For example: "What have you tried so far?" or "What do you think the next step should be?"
  - Keep your answers concise but informative.
  - Use technical details and ask clarifying questions for broad topics.
  - If the user provides an image or a file, analyze its content and incorporate your analysis into your response.

  User's message: {{{message}}}

  {{#if media}}
  The user has also uploaded the following file. Analyze it as part of your response:
  File: {{media url=media.url}}
  {{/if}}
`,
});

const mentorChatFlow = ai.defineFlow(
  {
    name: 'mentorChatFlow',
    inputSchema: MentorChatInputSchema,
    outputSchema: MentorChatOutputSchema,
  },
  async input => {
    if (input.media) {
      const {output} = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: [
          {text: prompt.compile(input)},
          {media: {url: input.media.url, contentType: input.media.contentType}},
        ],
        output: {schema: MentorChatOutputSchema},
      });
      return output!;
    }

    const {output} = await prompt(input);
    return output!;
  }
);
