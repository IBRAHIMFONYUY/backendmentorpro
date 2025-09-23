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
  hasError: z.boolean().describe('Set to true if an error was found, otherwise false.'),
  output: z.string().describe('The predicted standard output of the code. If the code has errors that would prevent execution or print to stderr, this field should describe the error and its cause.'),
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
  prompt: `You are an AI code compiler and interpreter. Your task is to analyze a snippet of code and predict its output as if you were running it.

  - If the code is valid and would execute without errors, set 'hasError' to false and provide the exact standard output in the 'output' field.
  - If the code contains syntax errors, runtime errors, or logical issues that would cause it to fail or produce an error message, set 'hasError' to true. In the 'output' field, provide a concise error message, identify the problematic line, and give a brief explanation of the root cause, just like a real compiler or interpreter would. Do not suggest fixes unless it is part of the root cause explanation.

  Programming Language: {{{language}}}
  Code:
  \`\`\`{{{language}}}
  {{{code}}}
  \`\`\`
  Description: {{{description}}}
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
