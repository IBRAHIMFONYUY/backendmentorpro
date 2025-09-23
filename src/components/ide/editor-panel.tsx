
import { CodeEditor } from "@/components/code-editor";
import type { FileSystemNode } from "@/lib/ide-data";
import { File, FileJson, FileText, X } from "lucide-react";

interface EditorPanelProps {
    openTabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onCloseTab: (path: string, e: React.MouseEvent) => void;
    files: FileSystemNode;
    onCodeChange: (newCode: string) => void;
}

export function EditorPanel({ openTabs, activeTab, setActiveTab, onCloseTab, files, onCodeChange }: EditorPanelProps) {

    const findNode = (path: string, node: FileSystemNode): FileSystemNode | null => {
        if (node.path === path) return node;
        if (node.children) {
            for (const child of node.children) {
                const found = findNode(path, child);
                if (found) return found;
            }
        }
        return null;
    }
  
    const activeFileContent = findNode(activeTab, files)?.content ?? '';

    const getFileIcon = (filename: string) => {
        if (filename.endsWith('.js')) return <FileJson className="h-4 w-4 text-yellow-400" />;
        if (filename.endsWith('.json')) return <FileJson className="h-4 w-4 text-green-400" />;
        if (filename.endsWith('.md')) return <FileText className="h-4 w-4 text-blue-400" />;
        return <File className="h-4 w-4 text-muted-foreground" />;
    }

    return (
        <>
            <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center overflow-x-auto">
                {openTabs.map(path => (
                    <div 
                        key={path} 
                        onClick={() => setActiveTab(path)} 
                        className={`px-4 py-2 text-sm flex items-center gap-2 border-r border-gray-700 cursor-pointer shrink-0 ${activeTab === path ? 'tab-active text-white' : 'text-gray-400'}`}
                    >
                        {getFileIcon(path.split('/').pop() || '')}
                        <span>{path.split('/').pop()}</span>
                        <X className="h-4 w-4 hover:text-white" onClick={(e) => onCloseTab(path, e)}/>
                    </div>
                ))}
            </div>
            <div className="flex-1 relative bg-[#1e1e1e]">
                {openTabs.length > 0 ? (
                    <CodeEditor 
                        value={activeFileContent} 
                        onChange={(e) => onCodeChange(e.target.value)} 
                        language={(activeTab.split('.').pop() || 'javascript')}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Select a file to begin editing.</p>
                    </div>
                )}
            </div>
        </>
    );
}
