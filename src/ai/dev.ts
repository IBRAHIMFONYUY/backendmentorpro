'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-personalized-learning-path.ts';
import '@/ai/flows/summarize-learning-analytics.ts';
import '@/ai/flows/provide-real-time-code-assistance.ts';
import '@/ai/flows/generate-debugging-assistance.ts';
import '@/ai/flows/mentor-chat.ts';
import '@/ai/flows/review-challenge-submission.ts';
import '@/ai/flows/generate-project-ideas.ts';
import '@/ai/flows/tech-advisor.ts';
import '@/ai/flows/speech-to-text.ts';
import '@/ai/flows/generate-lab-content.ts';
import '@/ai/flows/summarize-video-content.ts';
import '@/ai/flows/smart-video-search.ts';
import '@/ai/flows/analyze-system-design.ts';
