

import { CodeIdeView } from "@/components/code-ide-view";
import { challenges } from "@/lib/data";

export default function ApiPlaygroundPage() {
    // Use a default challenge or the first one for the standalone IDE view
    const defaultChallenge = challenges[0];

    return (
        <div className="h-[calc(100vh-10rem)] -m-8">
            <CodeIdeView challenge={defaultChallenge} />
        </div>
    );
}
    
