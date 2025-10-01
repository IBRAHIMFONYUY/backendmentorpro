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
    .array(z.string())
    .describe('The learning goals of the user (e.g., learn React, master data structures).'),
});
export type GeneratePersonalizedLearningPathInput = z.infer<
  typeof GeneratePersonalizedLearningPathInputSchema
>;

const LearningStepSchema = z.object({
  title: z.string().describe('The title of the learning step.'),
  description: z.string().describe('A brief, one-sentence description of what this step covers.'),
  type: z.enum(['Challenge', 'Article', 'Video', 'Quiz', 'Project']).describe('The type of learning resource for this step.'),
});

const LearningModuleSchema = z.object({
  title: z.string().describe('The title of the module (e.g., "Introduction to Node.js", "Advanced System Design").'),
  steps: z.array(LearningStepSchema).describe('An array of 3-5 learning steps within this module.'),
});

const GeneratePersonalizedLearningPathOutputSchema = z.object({
  title: z.string().describe('A catchy title for the entire learning path.'),
  modules: z.array(LearningModuleSchema).describe('A structured learning path with specific modules and steps.'),
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
  prompt: `You are an expert AI career coach for software developers. Your task is to generate a personalized, structured learning path based on the user's current skill level and learning goals.

The path should be broken down into 4-6 logical modules. Each module must contain 3-5 specific, actionable steps. Each step should have a clear title, a one-sentence description, and a resource type (Challenge, Article, Video, Quiz, or Project).

Be concise, structured, and ensure the path is realistic and progresses logically from one module to the next.

Current Skill Level: {{{currentSkillLevel}}}
Learning Goals:
{{#each learningGoals}}
- {{{this}}}
{{/each}}

Generate the personalized learning path now.
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
