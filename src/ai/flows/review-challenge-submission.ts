'use server';

/**
 * @fileOverview An AI flow to review and test a user's code submission for a given challenge.
 *
 * - reviewChallengeSubmission - A function that orchestrates the review process.
 * - ReviewChallengeSubmissionInput - The input type for the reviewChallengeSubmission function.
 * - ReviewChallengeSubmissionOutput - The return type for the reviewChallengeSubmission function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewChallengeSubmissionInputSchema = z.object({
    challengeTitle: z.string().describe("The title of the coding challenge."),
    challengeDescription: z.string().describe("The detailed description and requirements of the challenge."),
    files: z.string().describe("A string representation of the user's file system, including file names, paths, and their content."),
});
export type ReviewChallengeSubmissionInput = z.infer<typeof ReviewChallengeSubmissionInputSchema>;


const TestResultSchema = z.object({
  name: z.string().describe("The name of the specific test case (e.g., 'Basic server setup', 'Handles invalid input')."),
  status: z.enum(['passed', 'failed']).describe("The result of the test case."),
  output: z.string().describe("A concise, one-sentence explanation for the test result. If it failed, explain why."),
});

const ReviewChallengeSubmissionOutputSchema = z.object({
    results: z.array(TestResultSchema).describe("An array of test case results."),
    overallStatus: z.enum(['passed', 'failed']).describe("The overall status of the submission. 'passed' only if all individual tests passed."),
    feedback: z.string().describe("Overall feedback on the code submission, highlighting areas for improvement or praising good practices."),
});
export type ReviewChallengeSubmissionOutput = z.infer<typeof ReviewChallengeSubmissionOutputSchema>;

export async function reviewChallengeSubmission(
  input: ReviewChallengeSubmissionInput
): Promise<ReviewChallengeSubmissionOutput> {
  return reviewChallengeSubmissionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reviewChallengeSubmissionPrompt',
  input: {schema: ReviewChallengeSubmissionInputSchema},
  output: {schema: ReviewChallengeSubmissionOutputSchema},
  prompt: `You are an expert AI code reviewer and automated test runner. Your task is to evaluate a user's code submission for a programming challenge.

  You will be given the challenge details and a representation of the user's project files.
  
  Your instructions are:
  1.  Analyze the provided code in the user's files against the requirements in the challenge description.
  2.  Create a series of 5-7 relevant test cases to validate the solution. The test cases should cover the core requirements, edge cases, and error handling.
  3.  For each test case, determine if the user's code would pass or fail.
  4.  Provide a clear, one-sentence explanation for each test result. If a test fails, your explanation MUST state the reason for the failure (e.g., "Missing error handling for expired tokens", "Endpoint does not return the correct status code on success").
  5.  Determine the 'overallStatus'. It should be 'passed' only if every single test case passed. Otherwise, it is 'failed'.
  6.  Provide constructive, high-level feedback on the user's submission.

  Challenge Title: {{{challengeTitle}}}
  Challenge Description:
  {{{challengeDescription}}}

  User's Project Files:
  \`\`\`
  {{{files}}}
  \`\`\`
  
  Evaluate the submission and provide the results in the required format.
`,
});

const reviewChallengeSubmissionFlow = ai.defineFlow(
  {
    name: 'reviewChallengeSubmissionFlow',
    inputSchema: ReviewChallengeSubmissionInputSchema,
    outputSchema: ReviewChallengeSubmissionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
