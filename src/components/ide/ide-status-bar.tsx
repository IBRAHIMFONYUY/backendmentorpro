
import { Bot, GitBranch, Wifi } from "lucide-react";

export function IdeStatusBar() {
    return (
        <div className="status-bar h-6 flex items-center justify-between px-4 text-xs shrink-0">
            <div className="flex items-center gap-4">
                <span>Ln 1, Col 1</span>
                <span>Javascript</span>
                <span>UTF-8</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1"><Wifi /><span>Connected</span></div>
                <div className="flex items-center gap-1"><GitBranch /><span>main</span></div>
                <div className="flex items-center gap-1"><Bot /><span>Rahim Ready</span></div>
                <span>Backend Mentor</span>
            </div>
        </div>
    );
}
