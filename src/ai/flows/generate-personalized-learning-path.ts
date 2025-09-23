'use server';

/**
 * @fileOverview Generates a personalized learning path based on user's skill level and learning goals.
 *
 * - generatePersonalizedLearningPath - A function that generates the personalized learning path.
 * - GeneratePersonalizedLearningPathInput - The input type for the generatePersonalizedLearningPath function.
 * - GeneratePersonalizedLearningPathOutput - The return type for the generatePersonalizedLearningPath function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedLearningPathInputSchema = z.object({
  currentSkillLevel: z
    .string()
    .describe('The current skill level of the user (e.g., beginner, intermediate, advanced).'),
  learningGoals: z
    .string()
    .describe('The learning goals of the user (e.g., learn React, master data structures).'),
});
export type GeneratePersonalizedLearningPathInput = z.infer<
  typeof GeneratePersonalizedLearningPathInputSchema
>;

const GeneratePersonalizedLearningPathOutputSchema = z.object({
  learningPath: z
    .string()
    .describe('A structured learning path with specific topics and resources.'),
});
export type GeneratePersonalizedLearningPathOutput = z.infer<
  typeof GeneratePersonalizedLearningPathOutputSchema
>;

export async function generatePersonalizedLearningPath(
  input: GeneratePersonalizedLearningPathInput
): Promise<GeneratePersonalizedLearningPathOutput> {
  return generatePersonalizedLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedLearningPathPrompt',
  input: {schema: GeneratePersonalizedLearningPathInputSchema},
  output: {schema: GeneratePersonalizedLearningPathOutputSchema},
  prompt: `You are an AI mentor. Generate a personalized learning path for the user based on their current skill level and learning goals.

Current Skill Level: {{{currentSkillLevel}}}
Learning Goals: {{{learningGoals}}}

Provide a structured learning path with specific topics and resources. Be concise and to the point.
`,
});

const generatePersonalizedLearningPathFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedLearningPathFlow',
    inputSchema: GeneratePersonalizedLearningPathInputSchema,
    outputSchema: GeneratePersonalizedLearningPathOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
