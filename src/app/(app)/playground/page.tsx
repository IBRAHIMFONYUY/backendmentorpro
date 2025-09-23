

import { CodeIdeView } from "@/components/code-ide-view";
import { challenges } from "@/lib/data";

export default function ApiPlaygroundPage() {
    // Use a default challenge or the first one for the standalone IDE view
    const defaultChallenge = challenges[2]; // Use API Rate Limiter challenge

    return (
        <div className="fixed inset-0 bg-background">
            <CodeIdeView challenge={defaultChallenge} />
        </div>
    );
}
    
