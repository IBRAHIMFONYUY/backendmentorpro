
import { challenges as allChallenges } from '@/lib/challenges-data';
import type { Challenge, TestCase, RunCodeInput, RunCodeOutput } from '@/lib/challenges-data';

export type { Challenge, TestCase, RunCodeInput, RunCodeOutput };


export async function getChallenges(): Promise<Challenge[]> {
  // Simulate async operation
  return Promise.resolve(allChallenges);
}

export async function getChallenge(id: string): Promise<Challenge | null> {
    const challenge = allChallenges.find(c => c.id === id);
    // Simulate async operation
    return Promise.resolve(challenge || null);
}
