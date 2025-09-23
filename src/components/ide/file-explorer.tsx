
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, File, FileJson, FileText, Folder, FolderOpen, FolderPlus, Loader2, RefreshCw, XCircle, PlusCircle } from 'lucide-react';
import type { FileSystemNode, TestResult } from '@/lib/ide-data';

interface FileExplorerProps {
    files: FileSystemNode;
    activeTab: string;
    openTabs: string[];
    setOpenTabs: (tabs: string[]) => void;
    setActiveTab: (tab: string) => void;
    testResults: TestResult[];
}

export function FileExplorer({ files, activeTab, openTabs, setOpenTabs, setActiveTab, testResults }: FileExplorerProps) {
    const passedTests = testResults.filter(r => r.status === 'passed').length;
    const totalTests = testResults.length;
    const progressValue = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    const getFileIcon = (filename: string) => {
        if (filename.endsWith('.js')) return <FileJson className="h-4 w-4 text-yellow-400" />;
        if (filename.endsWith('.json')) return <FileJson className="h-4 w-4 text-green-400" />;
        if (filename.endsWith('.md')) return <FileText className="h-4 w-4 text-blue-400" />;
        return <File className="h-4 w-4 text-muted-foreground" />;
    }

    const FileTree = ({ node, level = 0 }: { node: FileSystemNode, level?: number }) => {
        const [isOpen, setIsOpen] = useState(true);
        const isFolder = node.type === 'folder';

        const handleToggle = () => {
            if (isFolder) {
                setIsOpen(!isOpen);
            }
        };

        const handleFileClick = (path: string) => {
            if (!openTabs.includes(path)) {
                setOpenTabs([...openTabs, path]);
            }
            setActiveTab(path);
        };

        return (
            <div className="text-sm">
                <div 
                    className={`flex items-center space-x-2 p-1 rounded-md hover:bg-muted cursor-pointer ${activeTab === node.path && !isFolder ? 'bg-primary/20' : ''}`} 
                    style={{ paddingLeft: `${level * 1.5}rem` }}
                    onClick={() => isFolder ? handleToggle() : handleFileClick(node.path)}
                >
                    {isFolder ? (
                        isOpen ? <FolderOpen className="h-4 w-4 text-blue-400" /> : <Folder className="h-4 w-4 text-blue-400" />
                    ) : getFileIcon(node.name)}
                    <span className="text-sm">{node.name}</span>
                </div>
                {isFolder && isOpen && node.children && (
                    <div>
                        {node.children.map(child => <FileTree key={child.path} node={child} level={level + 1} />)}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#0f172a] text-gray-400">
            <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                <h3 className="text-xs font-semibold tracking-wider uppercase">Explorer</h3>
                <div className="flex gap-2">
                    <button title="New File" className="hover:text-white"><File className="h-4 w-4" /></button>
                    <button title="New Folder" className="hover:text-white"><FolderPlus className="h-4 w-4" /></button>
                    <button title="Refresh" className="hover:text-white"><RefreshCw className="h-4 w-4" /></button>
                </div>
            </div>
            <ScrollArea className="flex-grow p-2">
               <FileTree node={files} />
            </ScrollArea>
            <div className="p-3 border-t border-gray-700">
              <div className="text-xs text-muted-foreground mb-2 flex justify-between">
                <span>Progress</span>
                <span>{passedTests}/{totalTests} tests</span>
              </div>
               <Progress value={progressValue} className="h-1.5" />
               <div className="mt-3 space-y-1.5 text-xs">
                  {testResults.map(result => (
                    <div key={result.name} className="flex items-center gap-2">
                      {result.status === 'passed' ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> :
                       result.status === 'failed' ? <XCircle className="h-3.5 w-3.5 text-red-500" /> :
                       <Loader2 className="h-3.5 w-3.5 text-yellow-500 animate-spin"/>
                      }
                      <span className={`${result.status === 'failed' ? 'text-red-400' : ''} truncate`}>{result.name}</span>
                    </div>
                  ))}
               </div>
            </div>
        </div>
    );
}
