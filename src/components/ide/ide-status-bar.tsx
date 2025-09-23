
import { Bot, GitBranch, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import type { editor } from "monaco-editor";

interface IdeStatusBarProps {
    editor: editor.IStandaloneCodeEditor | null;
}

export function IdeStatusBar({ editor }: IdeStatusBarProps) {
    const [status, setStatus] = useState({
        line: 1,
        column: 1,
        language: 'javascript',
    });

    useEffect(() => {
        if (!editor) return;

        const updateStatus = () => {
            const position = editor.getPosition();
            const model = editor.getModel();
            setStatus({
                line: position?.lineNumber || 1,
                column: position?.column || 1,
                language: model?.getLanguageId() || 'plaintext',
            });
        };

        const disposable = editor.onDidChangeCursorPosition(updateStatus);
        const modelDisposable = editor.onDidChangeModelLanguage(updateStatus);
        
        updateStatus(); // Initial update

        return () => {
            disposable.dispose();
            modelDisposable.dispose();
        };

    }, [editor]);

    return (
        <div className="status-bar h-6 flex items-center justify-between px-4 text-xs shrink-0">
            <div className="flex items-center gap-4">
                <span>Ln {status.line}, Col {status.column}</span>
                <span className="capitalize">{status.language}</span>
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

    