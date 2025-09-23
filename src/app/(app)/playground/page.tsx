import { CodeIdeView } from "@/components/code-ide-view";
import { challenges } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Backend Mentor - Playground",
    description: "The Backend Mentor code playground, a full-featured, web-based IDE for backend development.",
};


export default function ApiPlaygroundPage() {
    // Use a default challenge or the first one for the standalone IDE view
    const defaultChallenge = challenges[2]; // Use API Rate Limiter challenge

    return (
        <CodeIdeView challenge={defaultChallenge} />
    );
}
