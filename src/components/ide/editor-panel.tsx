
import React, { useEffect, useRef } from "react";
import type { FileSystemNode } from "@/lib/ide-data";
import { File, FileJson, FileText, X, Code, Braces } from "lucide-react";
import type { editor } from "monaco-editor";
import { IdeSettings } from "./settings-modal";

interface EditorPanelProps {
    openTabs: string[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onCloseTab: (path: string, e: React.MouseEvent) => void;
    files: FileSystemNode;
    onCodeChange: (newCode: string) => void;
    editorSettings: IdeSettings | null;
    onContextMenu: (e: React.MouseEvent) => void;
    onEditorReady: (editor: editor.IStandaloneCodeEditor) => void;
}

const languageMap: { [key: string]: string } = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    md: "markdown",
    py: "python",
    html: "html",
    css: "css",
    java: "java",
    rs: "rust",
};


export function EditorPanel({ openTabs, activeTab, setActiveTab, onCloseTab, files, onCodeChange, editorSettings, onContextMenu, onEditorReady }: EditorPanelProps) {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const editorContainerRef = useRef<HTMLDivElement>(null);
    const monacoRef = useRef<any>(null);

    const findNode = (path: string, node: FileSystemNode): FileSystemNode | null => {
        if (!node) return null;
        if (node.path === path) return node;
        if (node.children) {
            for (const child of node.children) {
                const found = findNode(path, child);
                if (found) return found;
            }
        }
        return null;
    }
  
    const activeFile = findNode(activeTab, files);
    const activeFileContent = activeFile?.content ?? '';

    useEffect(() => {
        if (monacoRef.current) return;
        
        if ((window as any).monaco) {
            monacoRef.current = (window as any).monaco;
            initializeEditor();
        }

        return () => {
            editorRef.current?.dispose();
        };

    }, []);

    useEffect(() => {
        if (editorRef.current) {
            const model = editorRef.current.getModel();
            if (model && model.getValue() !== activeFileContent) {
                model.setValue(activeFileContent);
            }
            
            const fileExtension = activeTab.split('.').pop() || '';
            const language = languageMap[fileExtension] || 'plaintext';

            if (model) {
                monacoRef.current.editor.setModelLanguage(model, language);
            }
        }
    }, [activeTab, activeFileContent]);

    useEffect(() => {
        if (editorRef.current && editorSettings) {
            editorRef.current.updateOptions({
                fontSize: editorSettings.fontSize,
                tabSize: editorSettings.tabSize,
                wordWrap: editorSettings.wordWrap ? 'on' : 'off',
                minimap: { enabled: editorSettings.minimap },
            });
            monacoRef.current.editor.setTheme(editorSettings.theme === 'light' ? 'vs' : 'vs-dark');
        }
    }, [editorSettings]);


    const initializeEditor = () => {
        if (editorContainerRef.current) {
            editorRef.current = monacoRef.current.editor.create(editorContainerRef.current, {
                value: activeFileContent,
                language: 'javascript',
                theme: 'vs-dark',
                automaticLayout: true,
            });

            if (editorRef.current) {
              onEditorReady(editorRef.current);
            }

            editorRef.current.onDidChangeModelContent(() => {
                const value = editorRef.current?.getValue();
                if (value !== activeFileContent) {
                    onCodeChange(value || '');
                }
            });
        }
    };


    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop();
        switch (ext) {
            case 'js':
            case 'jsx':
                return <FileJson className="h-4 w-4 text-yellow-400" />;
            case 'ts':
            case 'tsx':
                return <FileJson className="h-4 w-4 text-blue-400" />;
            case 'json':
                return <Braces className="h-4 w-4 text-green-400" />;
            case 'md':
                return <FileText className="h-4 w-4 text-blue-300" />;
            case 'html':
                return <Code className="h-4 w-4 text-orange-400" />;
            case 'css':
                 return <FileText className="h-4 w-4 text-sky-400" />;
            case 'py':
                 return <FileJson className="h-4 w-4 text-green-500" />;
            default:
                return <File className="h-4 w-4 text-muted-foreground" />;
        }
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
            <div 
                className="flex-1 relative bg-[#1e1e1e]" 
                ref={editorContainerRef}
                onContextMenu={onContextMenu}
            >
                {openTabs.length === 0 && (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Select a file to begin editing or create a new one.</p>
                    </div>
                )}
            </div>
        </>
    );
}
