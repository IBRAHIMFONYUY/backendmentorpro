
'use server';

/**
 * @fileOverview This file defines a Genkit flow for the AI Mentor chat functionality.
 *
 * - aiMentorChat - A function that handles the AI mentor chat interaction.
 * - AIMentorChatInput - The input type for the aiMentorChat function.
 * - AIMentorChatOutput - The return type for the aiMentorChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AIMentorChatInputSchema = z.object({
  message: z.string().describe('The user message to the AI mentor.'),
  history: z
    .array(z.object({ role: z.enum(['user', 'model']), content: z.string() }))
    .describe('The chat history between the user and the AI mentor.'),
  user: z
    .object({
      name: z.string().optional().describe('The name of the user.'),
      skillLevel: z.string().optional().describe('The skill level of the user.'),
    })
    .optional()
    .describe('Information about the current user.'),
  context: z.object({
      challengeTitle: z.string().optional().describe("The title of the current challenge."),
      challengeDescription: z.string().optional().describe("The description of the current challenge."),
      currentCode: z.string().optional().describe("The user's current code in the editor."),
  }).optional().describe("Contextual information about the user's current task.")
});
export type AIMentorChatInput = z.infer<typeof AIMentorChatInputSchema>;

const AIMentorChatOutputSchema = z.object({
  response: z.string().describe('The AI response to the user.'),
});
export type AIMentorChatOutput = z.infer<typeof AIMentorChatOutputSchema>;

export async function aiMentorChat(
  input: AIMentorChatInput
): Promise<AIMentorChatOutput> {
  return aiMentorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMentorChatPrompt',
  input: { schema: AIMentorChatInputSchema },
  output: { schema: AIMentorChatOutputSchema },
  prompt: `You are Rahim, an AI coding mentor for the "Backend Mentor Evolved" platform. You are an expert in all backend technologies, especially Node.js, Express, and API security. Your personality is friendly, encouraging, and slightly informal, like a senior developer guiding a junior.

  Your goal is to help users on their learning journey. You are here to guide, not to give away answers directly. Encourage them to think and learn.

  About the Platform:
  - Name: Backend Mentor Evolved
  - Creator: Ibrahim Fonyuy
  - Purpose: A gamified learning environment where users tackle real-world backend and fullstack coding challenges, earn XP, climb leaderboards, and unlock achievements.
  - Core Technologies: The platform is built using Next.js, React, Tailwind CSS for the frontend, and Firebase for the backend (including Auth and Firestore). The AI features are powered by Google's Genkit.
  - Key Features:
    - Interactive coding challenges with automated validation.
    - AI-powered tools: Real-time assistant (that's you!), code reviewer, project idea generator, and tech stack advisor.
    - Gamification: Experience points (XP), leaderboards, achievements, and user profiles with stats.
    - Community: A place for developers to collaborate and learn together.

  User Information:
  - Name: {{{user.name}}}
  - Skill Level: {{{user.skillLevel}}}

  {{#if context}}
  Current Challenge Context:
  - Challenge: {{{context.challengeTitle}}}
  - Description: {{{context.challengeDescription}}}
  - User's Code:
  \`\`\`
  {{{context.currentCode}}}
  \`\`\`
  {{/if}}

  Chat History:
  {{#each history}}
  {{role}}: {{content}}
  {{/each}}

  New User Message: {{{message}}}

  Your Task:
  Based on all the context provided (about the platform, the user, the current challenge, and the chat history), provide a helpful and encouraging response to the new user message. Keep your answers concise and easy to read. Use markdown for formatting if needed. If asked about the site creator, mention Ibrahim Fonyuy. If asked about the tech stack, mention Next.js and Firebase. If the user asks for help with their code, refer to the provided context.
  `,
});

const aiMentorChatFlow = ai.defineFlow(
  {
    name: 'aiMentorChatFlow',
    inputSchema: AIMentorChatInputSchema,
    outputSchema: AIMentorChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return {
      response: output!.response,
    };
  }
);
