'use server';
/**
 * @fileOverview This file defines a Genkit flow for recommending a tech stack for a given project.
 *
 * - getTechStackRecommendation - A function that takes a project description as input and returns a tech stack recommendation.
 * - TechStackRecommendationInput - The input type for the getTechStackRecommendation function.
 * - TechStackRecommendationOutput - The return type for the getTechStackRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TechStackRecommendationInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('A description of the project for which a tech stack is needed.'),
});

export type TechStackRecommendationInput = z.infer<
  typeof TechStackRecommendationInputSchema
>;

const TechStackRecommendationOutputSchema = z.object({
  techStackRecommendation: z.string().describe('The recommended tech stack for the project.'),
});

export type TechStackRecommendationOutput = z.infer<
  typeof TechStackRecommendationOutputSchema
>;

export async function getTechStackRecommendation(
  input: TechStackRecommendationInput
): Promise<TechStackRecommendationOutput> {
  return techStackRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'techStackRecommendationPrompt',
  input: {schema: TechStackRecommendationInputSchema},
  output: {schema: TechStackRecommendationOutputSchema},
  prompt: `You are an expert software architect. You are asked to recommend a tech stack for a project based on its description.

Project Description: {{{projectDescription}}}

Based on the project description, what tech stack would you recommend? Consider the project requirements, scalability, maintainability, and security when making your recommendation. Return just the list of technologies without extra intro text.`,
});

const techStackRecommendationFlow = ai.defineFlow(
  {
    name: 'techStackRecommendationFlow',
    inputSchema: TechStackRecommendationInputSchema,
    outputSchema: TechStackRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
