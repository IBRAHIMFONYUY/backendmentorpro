"use client";

import { CodeIdeView } from "./code-ide-view";
import { challenges } from "@/lib/data";

export function DebuggerView() {
    // Use a default challenge or the first one for the standalone IDE view
    const defaultChallenge = challenges[0];
    
    return <CodeIdeView challenge={defaultChallenge} />;
}
