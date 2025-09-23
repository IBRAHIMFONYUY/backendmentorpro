'use server';

/**
 * @fileOverview Provides expert advice on technology choices for a user's project.
 *
 * - getTechAdvice - A function that provides technology advice.
 * - GetTechAdviceInput - The input type for the getTechAdvice function.
 * - GetTechAdviceOutput - The return type for the getTechAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetTechAdviceInputSchema = z.object({
    projectDescription: z
        .string()
        .describe('A detailed description of the project the user wants to build.'),
    teamSize: z
        .string()
        .describe('The size of the development team (e.g., solo, small team, large team).'),
    mainGoals: z
        .string()
        .describe('The primary goals for the project (e.g., performance, scalability, rapid development).'),
});
export type GetTechAdviceInput = z.infer<typeof GetTechAdviceInputSchema>;


const TechRecommendationSchema = z.object({
  category: z.string().describe("The category of the technology (e.g., 'Programming Language', 'Database', 'Framework', 'Deployment')."),
  name: z.string().describe("The specific technology being recommended (e.g., 'Python', 'PostgreSQL', 'Django', 'Docker')."),
  justification: z.string().describe("A detailed, three-to-four sentence explanation for why this technology is a good fit, considering the project's goals and description."),
  alternatives: z.array(z.string()).describe("A list of 1-2 viable alternative technologies for this category.")
});

const GetTechAdviceOutputSchema = z.object({
    recommendations: z.array(TechRecommendationSchema).describe('A list of technology recommendations covering the full stack (language, framework, database, etc.).'),
    summary: z.string().describe("A concluding summary paragraph that explains how the recommended technologies form a cohesive and effective stack for the described project.")
});
export type GetTechAdviceOutput = z.infer<typeof GetTechAdviceOutputSchema>;

export async function getTechAdvice(
  input: GetTechAdviceInput
): Promise<GetTechAdviceOutput> {
  return getTechAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getTechAdvicePrompt',
  input: {schema: GetTechAdviceInputSchema},
  output: {schema: GetTechAdviceOutputSchema},
  prompt: `You are an expert AI Solutions Architect with 20 years of experience designing scalable and robust systems. A user needs advice on the best technology stack for their new project.

Your task is to analyze their project requirements and provide a recommended tech stack. For each recommendation (language, framework, database, etc.), you must provide a strong justification explaining *why* it's the right choice based on their goals.

Project Description:
{{{projectDescription}}}

Team Size: {{{teamSize}}}
Main Goals: {{{mainGoals}}}

Provide a list of recommendations covering the essential components of a modern web application stack. Conclude with a summary explaining how these technologies work together to meet the user's needs.
`,
});

const getTechAdviceFlow = ai.defineFlow(
  {
    name: 'getTechAdviceFlow',
    inputSchema: GetTechAdviceInputSchema,
    outputSchema: GetTechAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
