'use server';

/**
 * @fileOverview Provides AI-powered debugging assistance by identifying errors, suggesting fixes, and explaining root causes.
 *
 * - generateDebuggingAssistance - A function that orchestrates the debugging assistance process.
 * - GenerateDebuggingAssistanceInput - The input type for the generateDebuggingAssistance function.
 * - GenerateDebuggingAssistanceOutput - The return type for the generateDebuggingAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDebuggingAssistanceInputSchema = z.object({
  code: z
    .string()
    .describe('The code to debug.'),
  language: z
    .string()
    .describe('The programming language of the code.'),
  description: z
    .string()
    .optional()
    .describe('Optional description of the problem.'),
});
export type GenerateDebuggingAssistanceInput = z.infer<typeof GenerateDebuggingAssistanceInputSchema>;

const GenerateDebuggingAssistanceOutputSchema = z.object({
  errorIdentification: z.string().describe('Identified errors in the code.'),
  suggestedFixes: z.string().describe('Suggested fixes for the identified errors.'),
  rootCauseExplanation: z.string().describe('Explanation of the root causes of the errors.'),
});
export type GenerateDebuggingAssistanceOutput = z.infer<typeof GenerateDebuggingAssistanceOutputSchema>;

export async function generateDebuggingAssistance(
  input: GenerateDebuggingAssistanceInput
): Promise<GenerateDebuggingAssistanceOutput> {
  return generateDebuggingAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDebuggingAssistancePrompt',
  input: {schema: GenerateDebuggingAssistanceInputSchema},
  output: {schema: GenerateDebuggingAssistanceOutputSchema},
  prompt: `You are an AI mentor assisting a developer with debugging their code.

  Your task is to analyze the code, identify errors, suggest fixes, and explain the root causes.
  Consider the programming language and any provided description of the problem.

  Programming Language: {{{language}}}
  Code: {{{code}}}
  Description: {{{description}}}

  Provide your analysis in a structured format, covering error identification, suggested fixes, and root cause explanation.
`,
});

const generateDebuggingAssistanceFlow = ai.defineFlow(
  {
    name: 'generateDebuggingAssistanceFlow',
    inputSchema: GenerateDebuggingAssistanceInputSchema,
    outputSchema: GenerateDebuggingAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
