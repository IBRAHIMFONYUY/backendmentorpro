'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-personalized-learning-path.ts';
import '@/ai/flows/summarize-learning-analytics.ts';
import '@/ai/flows/provide-real-time-code-assistance.ts';
import '@/ai/flows/generate-debugging-assistance.ts';
import '@/ai/flows/mentor-chat.ts';
