'use server';

/**
 * @fileOverview Generates a complete learning lab (notes, quiz, assignment) for a given topic.
 *
 * - generateLabContent - A function that generates the lab content.
 * - GenerateLabContentInput - The input type for the generateLabContent function.
 * - GenerateLabContentOutput - The return type for the generateLabContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLabContentInputSchema = z.object({
  topic: z
    .string()
    .describe('The specific topic for the learning lab (e.g., "Introduction to JWTs", "Node.js Event Loop").'),
  resourceType: z
    .string()
    .describe("The type of resource requested, which informs the content's focus (e.g., 'Article', 'Quiz', 'Challenge').")
});
export type GenerateLabContentInput = z.infer<typeof GenerateLabContentInputSchema>;

const QuizQuestionSchema = z.object({
    questionText: z.string().describe('The text of the quiz question.'),
    options: z.array(z.string()).describe('An array of 4 possible answers for the question.'),
    correctAnswerIndex: z.number().int().min(0).max(3).describe('The 0-based index of the correct answer in the options array.'),
    explanation: z.string().describe("A brief explanation of why the correct answer is right.")
});

const GenerateLabContentOutputSchema = z.object({
    title: z.string().describe('A clear and concise title for the learning lab, based on the topic.'),
    notes: z.string().describe('Comprehensive, well-structured educational notes on the topic in Markdown format. Should include code examples where appropriate.'),
    quiz: z.object({
        questions: z.array(QuizQuestionSchema).min(5).max(5).describe('An array of exactly 5 quiz questions.')
    }).describe('A quiz to test the user\'s understanding of the topic.'),
    assignment: z.object({
        title: z.string().describe('A title for the practical coding assignment.'),
        description: z.string().describe('A clear, one-paragraph description of a practical coding task a user can do in the IDE to apply their knowledge.')
    }).describe('A practical assignment for the user.')
});
export type GenerateLabContentOutput = z.infer<typeof GenerateLabContentOutputSchema>;


export async function generateLabContent(
  input: GenerateLabContentInput
): Promise<GenerateLabContentOutput> {
  return generateLabContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLabContentPrompt',
  input: {schema: GenerateLabContentInputSchema},
  output: {schema: GenerateLabContentOutputSchema},
  prompt: `You are an expert curriculum developer for a platform that teaches backend and fullstack development. Your task is to generate a complete, self-contained "learning lab" for a given topic.

You must generate three things:
1.  **Notes**: Comprehensive, well-structured educational notes in Markdown format. They should be clear, easy to understand for the target resource type, and include code snippets (using Markdown code fences) where relevant.
2.  **Quiz**: A quiz with exactly 5 multiple-choice questions to test the user's understanding of the concepts covered in the notes. Each question must have 4 options, a correct answer index, and a brief explanation for the correct answer.
3.  **Assignment**: A practical, hands-on coding assignment that the user can complete in their IDE to apply what they've learned from the notes.

Generate the complete lab content now.

Topic: {{{topic}}}
Resource Type: {{{resourceType}}}
`,
});

const generateLabContentFlow = ai.defineFlow(
  {
    name: 'generateLabContentFlow',
    inputSchema: GenerateLabContentInputSchema,
    outputSchema: GenerateLabContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
