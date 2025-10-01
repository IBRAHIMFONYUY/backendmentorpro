'use server';

/**
 * @fileOverview Provides real-time analysis and feedback on a user's system design diagram.
 *
 * - analyzeSystemDesign - A function that analyzes the system design.
 * - AnalyzeSystemDesignInput - The input type for the analyzeSystemDesign function.
 * - AnalyzeSystemDesignOutput - The return type for the analyzeSystemDesign function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SystemComponentSchema = z.object({
  id: z.string(),
  type: z.string().describe("The type of component (e.g., 'Web Server', 'Database', 'Load Balancer')."),
  connections: z.array(z.string()).describe("An array of IDs of components it is connected to."),
});

const AnalyzeSystemDesignInputSchema = z.object({
  description: z.string().describe("The user's high-level goal for the system (e.g., 'A scalable social media feed')."),
  components: z.array(SystemComponentSchema).describe('An array of all components currently on the design canvas.')
});
export type AnalyzeSystemDesignInput = z.infer<typeof AnalyzeSystemDesignInputSchema>;

const FeedbackItemSchema = z.object({
    type: z.enum(['suggestion', 'warning', 'praise']).describe("The type of feedback: 'suggestion' for improvements, 'warning' for potential issues, or 'praise' for good practices."),
    message: z.string().describe("The specific feedback message, written in a concise and encouraging tone."),
    componentIds: z.array(z.string()).optional().describe("An optional array of component IDs this feedback relates to.")
});

const AnalyzeSystemDesignOutputSchema = z.object({
    overallAnalysis: z.string().describe("A brief, high-level analysis of the current design's viability for the user's goal."),
    feedback: z.array(FeedbackItemSchema).describe("An array of specific, actionable feedback items.")
});
export type AnalyzeSystemDesignOutput = z.infer<typeof AnalyzeSystemDesignOutputSchema>;


export async function analyzeSystemDesign(
  input: AnalyzeSystemDesignInput
): Promise<AnalyzeSystemDesignOutput> {
  return analyzeSystemDesignFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSystemDesignPrompt',
  input: {schema: AnalyzeSystemDesignInputSchema},
  output: {schema: AnalyzeSystemDesignOutputSchema},
  prompt: `You are Rahim, an expert AI Solutions Architect acting as a mentor. Your task is to analyze a user's system design in real-time and provide helpful, constructive feedback.

The user is trying to build: {{{description}}}

Here is the current state of their design, represented as a list of components and their connections:
{{#each components}}
- Component ID: {{this.id}}, Type: {{this.type}}, Connects to: [{{#if this.connections}}{{#each this.connections}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}none{{/if}}]
{{/each}}

Your instructions:
1.  **Overall Analysis**: Provide a one or two-sentence summary of the design's current state. Is it a good start? Is it missing key elements?
2.  **Specific Feedback**: Provide a list of actionable feedback items.
    - Use 'praise' for good design choices (e.g., using a load balancer).
    - Use 'suggestion' for potential improvements (e.g., "Consider adding a cache between the server and database to reduce read load.").
    - Use 'warning' for critical issues (e.g., "The web servers have no connection to a database, so they cannot store or retrieve data.").
    - Keep feedback concise, friendly, and educational. Act like a mentor guiding a student.
    - If a piece of feedback relates to specific components, you MUST include their IDs in the 'componentIds' field.

Analyze the design and provide your feedback.
`,
});

const analyzeSystemDesignFlow = ai.defineFlow(
  {
    name: 'analyzeSystemDesignFlow',
    inputSchema: AnalyzeSystemDesignInputSchema,
    outputSchema: AnalyzeSystemDesignOutputSchema,
  },
  async input => {
    // If there are no components, return a default starting message.
    if (input.components.length === 0) {
        return {
            overallAnalysis: "The canvas is empty. Let's start building! Drag a component from the toolbox to begin.",
            feedback: [
                { type: 'suggestion', message: "A good starting point for many web applications is a 'Web Server'." }
            ]
        };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
