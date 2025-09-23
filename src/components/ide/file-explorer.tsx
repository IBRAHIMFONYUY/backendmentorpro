
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, File, FileJson, FileText, Folder, FolderOpen, FolderPlus, RefreshCw, XCircle, Loader2, FilePlus, ChevronsRightLeft, Rows, Columns } from 'lucide-react';
import type { FileSystemNode, TestResult } from '@/lib/ide-data';
import { cn } from '@/lib/utils';

interface FileExplorerProps {
    files: FileSystemNode;
    activeTab: string;
    onFileSelect: (path: string) => void;
    testResults: TestResult[];
    onNewFile: () => void;
    onNewFolder: () => void;
    onRefresh: () => void;
    onCollapseAll: () => void;
    onExpandAll: () => void;
    openFolders: Set<string>;
    toggleFolder: (path: string) => void;
    selectedFolder: string;
}

export function FileExplorer({ 
    files, 
    activeTab, 
    onFileSelect, 
    testResults,
    onNewFile,
    onNewFolder,
    onRefresh,
    onCollapseAll,
    onExpandAll,
    openFolders,
    toggleFolder,
    selectedFolder,
}: FileExplorerProps) {
    const passedTests = testResults.filter(r => r.status === 'passed').length;
    const totalTests = testResults.length;
    const progressValue = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    const getFileIcon = (filename: string) => {
        if (filename.endsWith('.js')) return <FileJson className="h-4 w-4 text-yellow-400 shrink-0" />;
        if (filename.endsWith('.json')) return <FileJson className="h-4 w-4 text-green-400 shrink-0" />;
        if (filename.endsWith('.md')) return <FileText className="h-4 w-4 text-blue-400 shrink-0" />;
        return <File className="h-4 w-4 text-muted-foreground shrink-0" />;
    }

    const FileTree = ({ node, level = 0 }: { node: FileSystemNode, level?: number }) => {
        const isSelected = selectedFolder === node.path;
        
        if (node.type === 'folder') {
          const isOpen = openFolders.has(node.path);
          return (
            <div className="text-sm">
                <div 
                    className={cn(
                        "flex items-center space-x-2 p-1 rounded-md hover:bg-muted cursor-pointer",
                        isSelected && "bg-muted/50"
                    )}
                    style={{ paddingLeft: `${level * 0.5}rem` }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onFileSelect(node.path);
                    }}
                >
                    {isOpen ? <FolderOpen className="h-4 w-4 text-blue-400 shrink-0" /> : <Folder className="h-4 w-4 text-blue-400 shrink-0" />}
                    <span className="truncate">{node.name || '/'}</span>
                </div>
                {isOpen && node.children && (
                    <div className="pl-2">
                        {node.children.map(child => <FileTree key={child.path} node={child} level={level + 1} />)}
                    </div>
                )}
            </div>
          )
        }
        
        // Is a file
        return (
             <div 
                className={cn(
                    "flex items-center space-x-2 p-1 rounded-md hover:bg-muted cursor-pointer file-tree-item",
                    activeTab === node.path && 'active'
                )}
                style={{ paddingLeft: `${level * 0.5}rem` }}
                onClick={(e) => {
                    e.stopPropagation();
                    onFileSelect(node.path);
                }}
            >
                {getFileIcon(node.name)}
                <span className="truncate">{node.name}</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-inherit text-gray-300">
            <div className="p-3 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold tracking-wide uppercase">Explorer</h3>
                <div className="flex space-x-2">
                    <button onClick={onNewFile} className="text-gray-400 hover:text-white" title="New File"><FilePlus className="h-4 w-4" /></button>
                    <button onClick={onNewFolder} className="text-gray-400 hover:text-white" title="New Folder"><FolderPlus className="h-4 w-4" /></button>
                    <button onClick={onRefresh} className="text-gray-400 hover:text-white" title="Refresh"><RefreshCw className="h-4 w-4" /></button>
                    <button onClick={onExpandAll} className="text-gray-400 hover:text-white" title="Expand All"><Rows className="h-4 w-4" /></button>
                    <button onClick={onCollapseAll} className="text-gray-400 hover:text-white" title="Collapse All"><Columns className="h-4 w-4" /></button>
                </div>
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
               <Progress value={progressValue} className="h-2" />
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
