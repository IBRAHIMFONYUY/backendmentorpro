'use server';
/**
 * @fileOverview Provides real-time coding help, debugging assistance, and personalized learning recommendations from an AI mentor.
 *
 * - getCodingAssistance - A function that provides coding help, debugging assistance, and personalized learning recommendations.
 * - CodingAssistanceInput - The input type for the getCodingAssistance function.
 * - CodingAssistanceOutput - The return type for the getCodingAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodingAssistanceInputSchema = z.object({
  codeSnippet: z.string().describe('The code snippet the user is working on.'),
  programmingLanguage: z.string().describe('The programming language of the code snippet.'),
  userQuestion: z.string().describe('The specific question or problem the user is facing.'),
  userSkillLevel: z.string().describe('The skill level of the user (e.g., beginner, intermediate, advanced).'),
  learningGoals: z.string().describe('The learning goals of the user.'),
});
export type CodingAssistanceInput = z.infer<typeof CodingAssistanceInputSchema>;

const CodingAssistanceOutputSchema = z.object({
  assistance: z.string().describe('The AI mentor assistance, including code suggestions, debugging tips, and learning recommendations.'),
});
export type CodingAssistanceOutput = z.infer<typeof CodingAssistanceOutputSchema>;

export async function getCodingAssistance(input: CodingAssistanceInput): Promise<CodingAssistanceOutput> {
  return codingAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codingAssistancePrompt',
  input: {schema: CodingAssistanceInputSchema},
  output: {schema: CodingAssistanceOutputSchema},
  prompt: `You are an AI coding mentor named Rahim. You are an expert in all backend technologies. Your goal is to help users on the "Backend Mentor Evolved" platform, a gamified learning environment for backend developers.

The user is working on a coding challenge. Here is the context:
- User's Skill Level: {{{userSkillLevel}}}
- User's Learning Goals: {{{learningGoals}}}
- User's Question: {{{userQuestion}}}
- Programming Language: {{{programmingLanguage}}}
- Code Snippet:
\`\`\`{{programmingLanguage}}
{{{codeSnippet}}}
\`\`\`

Platform Context:
"Backend Mentor Evolved" is a platform where users learn by doing. It features interactive challenges, a leaderboard, achievements, and an AI assistant (that's you!). Your tone should be encouraging, knowledgeable, and slightly informal, like a friendly senior developer. You are here to guide, not just give away answers.

Your Task:
Provide real-time coding help, debugging assistance, and personalized learning recommendations.
1.  **Address the User's Question Directly:** Start by answering their specific question.
2.  **Analyze the Code:** Review the provided snippet for best practices, performance, readability, and potential bugs.
3.  **Provide Constructive Feedback:** Offer clear, actionable suggestions. If you suggest code changes, explain *why* you're making them.
4.  **Tailor to Skill Level:** Adjust the complexity of your explanation to the user's skill level. For a beginner, explain concepts simply. For an advanced user, you can be more technical.
5.  **Connect to Learning Goals:** Align your advice with their stated learning goals.
6.  **Be Concise and Helpful:** Format your response for readability using markdown (e.g., bolding, bullet points, and code blocks).
`,
});

const codingAssistanceFlow = ai.defineFlow(
  {
    name: 'codingAssistanceFlow',
    inputSchema: CodingAssistanceInputSchema,
    outputSchema: CodingAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
