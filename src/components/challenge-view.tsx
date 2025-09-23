"use client";

import { CodeIdeView } from "./code-ide-view";
import type { Challenge } from "@/lib/data";

export function ChallengeView({ challenge }: { challenge: Challenge }) {
    return <CodeIdeView challenge={challenge} />;
}
