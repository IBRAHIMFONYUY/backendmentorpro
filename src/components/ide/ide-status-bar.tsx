
import { Bot, GitBranch, Wifi } from "lucide-react";
import { useEffect, useState } from "react";
import type { editor } from "monaco-editor";

interface IdeStatusBarProps {
    editor: editor.IStandaloneCodeEditor | null;
}

function formatBytes(bytes: number, decimals = 1) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function IdeStatusBar({ editor }: IdeStatusBarProps) {
    const [status, setStatus] = useState({
        line: 1,
        column: 1,
        language: 'javascript',
        size: 0,
    });

    useEffect(() => {
        if (!editor) return;

        const updateStatus = () => {
            const position = editor.getPosition();
            const model = editor.getModel();
            const content = model?.getValue() || "";
            const size = new Blob([content]).size;

            setStatus({
                line: position?.lineNumber || 1,
                column: position?.column || 1,
                language: model?.getLanguageId() || 'plaintext',
                size: size,
            });
        };

        const cursorDisposable = editor.onDidChangeCursorPosition(updateStatus);
        const modelDisposable = editor.onDidChangeModel(updateStatus);
        const contentDisposable = editor.onDidChangeModelContent(updateStatus);
        
        updateStatus(); // Initial update

        return () => {
            cursorDisposable.dispose();
            modelDisposable.dispose();
            contentDisposable.dispose();
        };

    }, [editor]);

    return (
        <div className="status-bar h-6 flex items-center justify-between px-4 text-xs shrink-0">
            <div className="flex items-center gap-4">
                <span>Ln {status.line}, Col {status.column}</span>
                <span className="capitalize">{status.language}</span>
                <span>{formatBytes(status.size)}</span>
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
