import { challenges } from "@/lib/data";
import type { Metadata } from "next";
import dynamic from 'next/dynamic';

const CodeIdeView = dynamic(() => import('@/components/code-ide-view').then(mod => mod.CodeIdeView), { ssr: false });

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
