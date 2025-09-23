
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
  message: z.string().describe('The user\'s message to the AI mentor.'),
});
export type MentorChatInput = z.infer<typeof MentorChatInputSchema>;

const MentorChatOutputSchema = z.object({
  response: z.string().describe('The AI mentor\'s response.'),
});
export type MentorChatOutput = z.infer<typeof MentorChatOutputSchema>;

export async function mentorChat(input: MentorChatInput): Promise<MentorChatOutput> {
  return mentorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mentorChatPrompt',
  input: {schema: MentorChatInputSchema},
  output: {schema: MentorChatOutputSchema},
  prompt: `You are Rahim, an AI-powered coding mentor with a friendly, encouraging, and slightly witty personality. Your goal is to help developers solve problems, learn best practices, and become better backend engineers.

  - Keep your answers concise but informative.
  - Use technical details and code snippets where appropriate.
  - Maintain a conversational tone.
  - If the user asks for help with a broad topic, ask clarifying questions to narrow down the problem.
  - Your persona is knowledgeable, patient, and always ready to help.

  User's message: {{{message}}}
`,
});

const mentorChatFlow = ai.defineFlow(
  {
    name: 'mentorChatFlow',
    inputSchema: MentorChatInputSchema,
    outputSchema: MentorChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
