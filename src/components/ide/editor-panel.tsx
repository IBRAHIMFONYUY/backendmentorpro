
import React, { useEffect, useRef } from "react";
import type { FileSystemNode } from "@/lib/ide-data";
import { X } from "lucide-react";
import type { editor } from "monaco-editor";
import { type IdeSettings } from "./settings-modal";
import { getFileIcon } from "@/lib/ide-utils";

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
      const initMonaco = () => {
        if (editorContainerRef.current && !editorRef.current) {
          const editorInstance = monacoRef.current.editor.create(editorContainerRef.current, {
            value: activeFileContent,
            language: 'javascript',
            theme: 'vs-dark',
            fontSize: 14,
            fontFamily: "JetBrains Mono",
            minimap: { enabled: true },
            scrollBeyondLastLine: true,
            automaticLayout: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            wordWrap: "on",
            lineNumbers: "on",
            renderWhitespace: "selection",
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: "always",
            autoClosingQuotes: "always",
            autoIndent: "full",
            tabSize: 4,
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
          });

          editorInstance.onDidChangeModelContent(() => {
              const value = editorInstance.getValue();
              onCodeChange(value || '');
          });

          editorRef.current = editorInstance;
          onEditorReady(editorInstance);
        }
      };

      if ((window as any).monaco) {
        monacoRef.current = (window as any).monaco;
        initMonaco();
      } else {
        const script = document.querySelector('script[src*="monaco-editor"]');
        script?.addEventListener('load', () => {
          (window as any).require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.44.0/min/vs' } });
          (window as any).require(['vs/editor/editor.main'], () => {
            monacoRef.current = (window as any).monaco;
            initMonaco();
          });
        });
      }

      return () => {
          editorRef.current?.dispose();
          editorRef.current = null;
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onCodeChange, onEditorReady]);

    useEffect(() => {
        if (editorRef.current && monacoRef.current) {
            const model = editorRef.current.getModel();
            const fileExtension = activeTab.split('.').pop() || '';
            const language = languageMap[fileExtension] || 'plaintext';
            
            if (model) {
                monacoRef.current.editor.setModelLanguage(model, language);
                // Only update the model's value if it's different from the active file content.
                // This is crucial to prevent the cursor from jumping.
                if (model.getValue() !== activeFileContent) {
                    editorRef.current.setValue(activeFileContent);
                }
            }
        }
    }, [activeTab, activeFileContent]);


    useEffect(() => {
        if (editorRef.current && editorSettings && monacoRef.current) {
            editorRef.current.updateOptions({
                fontSize: editorSettings.fontSize,
                tabSize: editorSettings.tabSize,
                wordWrap: editorSettings.wordWrap ? 'on' : 'off',
                minimap: { enabled: editorSettings.minimap },
            });
            monacoRef.current.editor.setTheme(editorSettings.theme === 'light' ? 'vs' : 'vs-dark');
        }
    }, [editorSettings]);

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
