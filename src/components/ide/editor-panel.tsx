
import { CodeEditor } from "@/components/code-editor";
import { File, FileJson, FileText, X } from "lucide-react";

interface EditorPanelProps {
    openTabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    handleCloseTab: (path: string, e: React.MouseEvent) => void;
    activeFileContent: string;
    onCodeChange: (newCode: string) => void;
}

export function EditorPanel({ openTabs, activeTab, setActiveTab, handleCloseTab, activeFileContent, onCodeChange }: EditorPanelProps) {

    const getFileIcon = (filename: string) => {
        if (filename.endsWith('.js')) return <FileJson className="h-4 w-4 text-yellow-400" />;
        if (filename.endsWith('.json')) return <FileJson className="h-4 w-4 text-green-400" />;
        if (filename.endsWith('.md')) return <FileText className="h-4 w-4 text-blue-400" />;
        return <File className="h-4 w-4 text-muted-foreground" />;
    }

    return (
        <>
            <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center">
                {openTabs.map(path => (
                    <div key={path} onClick={() => setActiveTab(path)} className={`px-4 py-2 text-sm flex items-center gap-2 border-r border-gray-700 cursor-pointer ${activeTab === path ? 'tab-active text-white' : 'text-gray-400'}`}>
                        {getFileIcon(path.split('/').pop() || '')}
                        <span>{path.split('/').pop()}</span>
                        <X className="h-4 w-4 hover:text-white" onClick={(e) => handleCloseTab(path, e)}/>
                    </div>
                ))}
            </div>
            <div className="flex-1 relative">
                <CodeEditor value={activeFileContent} onChange={(e) => onCodeChange(e.target.value)} className="bg-[#0d1117] border-none"/>
            </div>
        </>
    );
}
