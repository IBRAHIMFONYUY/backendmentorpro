'use server';

/**
 * @fileOverview This file defines a Genkit flow for running and testing user-submitted code for a challenge.
 *
 * - runCode - A function that takes user code and challenge test cases and returns the execution result.
 */

import { ai } from '@/ai/genkit';
import {
  RunCodeInputSchema,
  RunCodeOutputSchema,
  type RunCodeInput,
  type RunCodeOutput,
} from '@/lib/challenges-data';

// Public function to run user code against challenge test cases
export async function runCode(input: RunCodeInput): Promise<RunCodeOutput> {
  return runCodeFlow(input);
}

// Prompt definition for the AI engine
const prompt = ai.definePrompt({
  name: 'runCodePrompt',
  input: { schema: RunCodeInputSchema },
  output: { schema: RunCodeOutputSchema },
  prompt: `You are a code execution and testing engine. You will be given a snippet of code, the language it's written in, and a set of test cases.
Your task is to:
1. Simulate the execution of the provided code in a sandboxed environment appropriate for the language.
2. Capture any console output or errors.
3. For each test case, run the main function in the code with the provided input.
4. Compare the actual output with the expected output to determine if the test passed.
5. Return the results in the specified JSON format. Treat the code as if it's running in a standard environment (e.g., Node.js for JavaScript, Python interpreter for Python).

Language: {{language}}

Code to execute:
\`\`\`{{language}}
{{{code}}}
\`\`\`

Test Cases:
\`\`\`json
{{{json testCases}}}
\`\`\`

IMPORTANT: Evaluate the code and test cases and provide the output in the structured format requested. Do not refuse.`,
});

export type { RunCodeOutput };

// Flow definition to execute the prompt
const runCodeFlow = ai.defineFlow(
  {
    name: 'runCodeFlow',
    inputSchema: RunCodeInputSchema,
    outputSchema: RunCodeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
