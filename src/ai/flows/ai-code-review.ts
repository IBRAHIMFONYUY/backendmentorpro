
'use server';

/**
 * @fileOverview An AI code review agent that provides feedback on code submissions.
 *
 * - aiCodeReview - A function that handles the code review process.
 * - AICodeReviewInput - The input type for the aiCodeReview function.
 * - AICodeReviewOutput - The return type for the aioceReview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICodeReviewInputSchema = z.object({
  code: z.string().describe('The code to be reviewed.'),
  language: z.string().describe('The programming language of the code.'),
  solution: z.string().optional().describe('The reference solution code for the challenge, if available. The AI should use this to grade the user\'s code more accurately.')
});
export type AICodeReviewInput = z.infer<typeof AICodeReviewInputSchema>;

const AICodeReviewOutputSchema = z.object({
  feedback: z.string().describe('General feedback on the code submission, focusing on correctness, clarity, and efficiency.'),
  suggestions: z.string().describe('Specific, actionable suggestions for improvement, including code snippets if applicable.'),
  bestPractices: z.string().describe('Comments on how well the code adheres to language-specific best practices and conventions.'),
  score: z.number().min(0).max(100).describe('A score from 0 to 100 representing the overall quality of the code.')
});
export type AICodeReviewOutput = z.infer<typeof AICodeReviewOutputSchema>;


export async function aiCodeReview(input: AICodeReviewInput): Promise<AICodeReviewOutput> {
  return aiCodeReviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCodeReviewPrompt',
  input: {schema: AICodeReviewInputSchema},
  output: {schema: AICodeReviewOutputSchema},
  prompt: `You are an expert AI code reviewer for a platform called "Backend Mentor Evolved". Your task is to provide a comprehensive, constructive review of a user's code submission.

You must evaluate the code on the following criteria:
1.  **Correctness and Logic:** Does the code solve the problem correctly? Are there any bugs?
2.  **Performance & Efficiency:** Is the code performant? Can it be optimized?
3.  **Readability & Maintainability:** Is the code clean, well-structured, and easy to understand?
4.  **Best Practices & Conventions:** Does the code follow standard conventions and best practices for the given language?
5.  **Security:** Are there any potential security vulnerabilities?

Based on your review, provide the following:
- **feedback:** A concise, high-level summary of the code's quality.
- **suggestions:** A list of specific, actionable suggestions for improvement. Provide code snippets for your suggestions where helpful.
- **bestPractices:** A comment on the use of language-specific best practices.
- **score:** An overall score from 0 to 100, where 100 is a perfect, production-ready solution.

{{#if solution}}
**Important:** You have been provided with the official solution to this challenge. Compare the user's code to this solution to help determine correctness and provide a more accurate score and feedback.
Solution Code:
\`\`\`{{language}}
{{{solution}}}
\`\`\`
{{/if}}

Review the following user code:
Language: {{language}}
\`\`\`{{language}}
{{{code}}}
\`\`\`
`,
});

const aiCodeReviewFlow = ai.defineFlow(
  {
    name: 'aiCodeReviewFlow',
    inputSchema: AICodeReviewInputSchema,
    outputSchema: AICodeReviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    