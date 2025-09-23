'use server';
/**
 * @fileOverview An AI mentor that provides real-time coding assistance and suggestions.
 *
 * - provideRealTimeCodeAssistance - A function that handles the code assistance process.
 * - ProvideRealTimeCodeAssistanceInput - The input type for the provideRealTimeCodeAssistance function.
 * - ProvideRealTimeCodeAssistanceOutput - The return type for the provideRealTimeCodeAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideRealTimeCodeAssistanceInputSchema = z.object({
  codeSnippet: z
    .string()
    .describe('The current code snippet the user is working on.'),
  programmingLanguage: z
    .string()
    .describe('The programming language of the code snippet.'),
  challengeDescription: z
    .string()
    .describe('The description of the coding challenge the user is attempting.'),
  userQuestion: z
    .string()
    .optional()
    .describe('Optional: A specific question the user has about the code or challenge.'),
});
export type ProvideRealTimeCodeAssistanceInput = z.infer<
  typeof ProvideRealTimeCodeAssistanceInputSchema
>;

const ProvideRealTimeCodeAssistanceOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('Code suggestions or improvements based on the code snippet.'),
  explanation: z
    .string()
    .describe('An explanation of the suggestions and how they improve the code.'),
  debuggingTips: z
    .string()
    .optional()
    .describe('Optional: Debugging tips if the code has errors.'),
  learningResources: z
    .string()
    .optional()
    .describe(
      'Optional: Links to learning resources related to the coding challenge or suggestions.'
    ),
});
export type ProvideRealTimeCodeAssistanceOutput = z.infer<
  typeof ProvideRealTimeCodeAssistanceOutputSchema
>;

export async function provideRealTimeCodeAssistance(
  input: ProvideRealTimeCodeAssistanceInput
): Promise<ProvideRealTimeCodeAssistanceOutput> {
  return provideRealTimeCodeAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideRealTimeCodeAssistancePrompt',
  input: {schema: ProvideRealTimeCodeAssistanceInputSchema},
  output: {schema: ProvideRealTimeCodeAssistanceOutputSchema},
  prompt: `You are an AI mentor providing real-time code assistance to a user working on a coding challenge.

  The user is working on the following challenge:
  {{challengeDescription}}

  The user has written the following code snippet:
  \`\`\`{{programmingLanguage}}
  {{codeSnippet}}
  \`\`\`

  {% if userQuestion %}The user has the following question:
  {{userQuestion}}{% endif %}

  Provide suggestions for improving the code, explain why the suggestions are helpful, and provide debugging tips if the code has errors. Also provide learning resources related to the challenge or suggestions.

  Suggestions:
  Explanation:
  Debugging Tips:
  Learning Resources:`,
});

const provideRealTimeCodeAssistanceFlow = ai.defineFlow(
  {
    name: 'provideRealTimeCodeAssistanceFlow',
    inputSchema: ProvideRealTimeCodeAssistanceInputSchema,
    outputSchema: ProvideRealTimeCodeAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
