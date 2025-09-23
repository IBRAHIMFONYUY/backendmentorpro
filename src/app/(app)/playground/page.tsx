'use client';

import { challenges } from "@/lib/data";
import dynamic from 'next/dynamic';

const CodeIdeView = dynamic(() => import('@/components/code-ide-view').then(mod => mod.CodeIdeView), { ssr: false });

// Note: Metadata export in a client component is not standard for Next.js 13+ App Router.
// For page-level metadata, it should be in a layout.tsx or page.tsx (Server Component).
// However, to fix the immediate build error, we are making this a client component.
// A better long-term solution would be to have a Server Component page that wraps a client component containing the dynamic import.
// For now, this resolves the build failure.

export default function ApiPlaygroundPage() {
    // Use a default challenge or the first one for the standalone IDE view
    const defaultChallenge = challenges[2]; // Use API Rate Limiter challenge

    return (
        <CodeIdeView challenge={defaultChallenge} />
    );
}
