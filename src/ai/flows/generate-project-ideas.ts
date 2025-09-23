'use server';

/**
 * @fileOverview Generates project ideas based on user interests and technology preferences.
 *
 * - generateProjectIdeas - A function that generates project ideas.
 * - GenerateProjectIdeasInput - The input type for the generateProjectIdeas function.
 * - GenerateProjectIdeasOutput - The return type for the generateProjectIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectIdeasInputSchema = z.object({
    interests: z
        .string()
        .describe('User\'s interests (e.g., music, finance, gaming).'),
    technologies: z
        .string()
        .describe('Preferred technologies (e.g., Node.js, Python, GraphQL).'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).describe('The desired difficulty level for the projects.')
});
export type GenerateProjectIdeasInput = z.infer<typeof GenerateProjectIdeasInputSchema>;

const ProjectIdeaSchema = z.object({
    title: z.string().describe('A catchy and descriptive title for the project.'),
    description: z.string().describe('A one-paragraph summary of the project, what it does, and its core features.'),
    technologies: z.array(z.string()).describe('A list of recommended technologies and tools for building the project.'),
    features: z.array(z.string()).describe('A list of 3-5 key features to implement.'),
});

const GenerateProjectIdeasOutputSchema = z.object({
    ideas: z.array(ProjectIdeaSchema).describe('An array of 3 unique and creative project ideas.'),
});
export type GenerateProjectIdeasOutput = z.infer<typeof GenerateProjectIdeasOutputSchema>;


export async function generateProjectIdeas(
  input: GenerateProjectIdeasInput
): Promise<GenerateProjectIdeasOutput> {
  return generateProjectIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectIdeasPrompt',
  input: {schema: GenerateProjectIdeasInputSchema},
  output: {schema: GenerateProjectIdeasOutputSchema},
  prompt: `You are an AI career coach for software developers. Your task is to generate 3 unique and creative backend or full-stack project ideas based on the user's interests and preferred technologies.

The projects should be realistic for a portfolio but also interesting and challenging for the specified difficulty level. For each project, provide a title, a short description, a list of recommended technologies, and a list of key features.

User's Interests: {{{interests}}}
Preferred Technologies: {{{technologies}}}
Difficulty Level: {{{difficulty}}}

Generate 3 distinct project ideas now.
`,
});

const generateProjectIdeasFlow = ai.defineFlow(
  {
    name: 'generateProjectIdeasFlow',
    inputSchema: GenerateProjectIdeasInputSchema,
    outputSchema: GenerateProjectIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
