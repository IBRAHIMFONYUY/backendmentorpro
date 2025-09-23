
import React, { useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { FileSystemNode } from "@/lib/ide-data";
import { X } from "lucide-react";
import type { editor } from "monaco-editor";
import { type IdeSettings } from "./settings-modal";
import { getFileIcon } from "@/lib/ide-utils";

export const languageMap: { [key: string]: string } = {
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
    env: "shell",
    yml: "yaml",
    yaml: "yaml",
    c: "c",
    cpp: "cpp",
    go: "go",
    php: "php",
    rb: "ruby",
    swift: "swift",
    kt: "kotlin",
    scala: "scala",
};

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


export function EditorPanel({ openTabs, activeTab, setActiveTab, onCloseTab, files, onCodeChange, editorSettings, onContextMenu, onEditorReady }: EditorPanelProps) {
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
    const fileExtension = activeTab.split('.').pop() || '';
    const language = languageMap[fileExtension] || 'plaintext';

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        onEditorReady(editor);
        // You can add command listeners here if needed
        // e.g. editor.addCommand(...)
    }

    return (
        <>
            <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center overflow-x-auto">
                {openTabs.map(path => {
                    const node = findNode(path, files);
                    if (!node) return null;
                    return (
                        <div 
                            key={path} 
                            onClick={() => setActiveTab(path)} 
                            className={`px-4 py-2 text-sm flex items-center gap-2 border-r border-gray-700 cursor-pointer shrink-0 ${activeTab === path ? 'tab-active text-white' : 'text-gray-400'}`}
                        >
                            {getFileIcon(node.name)}
                            <span>{node.name}</span>
                            <X className="h-4 w-4 hover:text-white" onClick={(e) => onCloseTab(path, e)}/>
                        </div>
                    )
                })}
            </div>
            <div 
                className="flex-1 relative" 
                onContextMenu={onContextMenu}
            >
                {openTabs.length > 0 ? (
                    <Editor
                      height="100%"
                      path={activeTab}
                      defaultValue={activeFileContent}
                      language={language}
                      theme={editorSettings?.theme}
                      value={activeFileContent}
                      onMount={handleEditorDidMount}
                      onChange={(value) => onCodeChange(value || '')}
                      options={{
                          fontSize: editorSettings?.fontSize,
                          tabSize: editorSettings?.tabSize,
                          wordWrap: editorSettings?.wordWrap ? "on" : "off",
                          minimap: { enabled: editorSettings?.minimap },
                          scrollBeyondLastLine: true,
                          automaticLayout: true,
                          suggestOnTriggerCharacters: true,
                          quickSuggestions: true,
                          lineNumbers: "on",
                          renderWhitespace: "selection",
                          bracketPairColorization: { enabled: true },
                          autoClosingBrackets: "always",
                          autoClosingQuotes: "always",
                          autoIndent: "full",
                          insertSpaces: true,
                          detectIndentation: true,
                          formatOnType: true,
                          formatOnPaste: true,
                          suggestSelection: "first",
                          cursorStyle: "line",
                          cursorBlinking: "smooth",
                          renderLineHighlight: "all",
                          roundedSelection: false,
                          smoothScrolling: true,
                      }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Select a file to begin editing or create a new one.</p>
                    </div>
                )}
            </div>
        </>
    );
}
