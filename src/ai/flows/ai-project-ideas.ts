'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating project ideas based on user skill level and chosen technologies.
 *
 * - generateProjectIdeas - A function that generates project ideas based on user input.
 * - ProjectIdeaInput - The input type for the generateProjectIdeas function.
 * - ProjectIdeaOutput - The return type for the generateProjectIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectIdeaInputSchema = z.object({
  skillLevel: z
    .string()
    .describe("The user's skill level (e.g., beginner, intermediate, advanced)."),
  technologies: z
    .string()
    .describe('A comma-separated list of technologies the user wants to use (e.g., React, Node.js, Python).'),
});
export type ProjectIdeaInput = z.infer<typeof ProjectIdeaInputSchema>;

const ProjectIdeaOutputSchema = z.object({
  projectIdeas: z.array(
    z.object({
      title: z.string().describe('The title of the project idea.'),
      description: z.string().describe('A detailed description of the project idea.'),
      suggestedTechStack: z
        .string()
        .describe('A comma-separated list of technologies suggested for the project.'),
    })
  ).describe('An array of project ideas.'),
});
export type ProjectIdeaOutput = z.infer<typeof ProjectIdeaOutputSchema>;

export async function generateProjectIdeas(input: ProjectIdeaInput): Promise<ProjectIdeaOutput> {
  return generateProjectIdeasFlow(input);
}

const projectIdeasPrompt = ai.definePrompt({
  name: 'projectIdeasPrompt',
  input: {schema: ProjectIdeaInputSchema},
  output: {schema: ProjectIdeaOutputSchema},
  prompt: `You are an AI project idea generator. A user will provide their skill level and a list of technologies they want to use.
  You will generate a list of project ideas that are appropriate for their skill level and that make use of the technologies they have specified.

  Skill level: {{{skillLevel}}}
  Technologies: {{{technologies}}}

  Please provide at least 3 project ideas.
  Each project idea should include:
  - A title for the project.
  - A detailed description of the project.
  - A suggested tech stack (a comma-separated list of technologies).
  `,
});

const generateProjectIdeasFlow = ai.defineFlow(
  {
    name: 'generateProjectIdeasFlow',
    inputSchema: ProjectIdeaInputSchema,
    outputSchema: ProjectIdeaOutputSchema,
  },
  async input => {
    const {output} = await projectIdeasPrompt(input);
    return output!;
  }
);
