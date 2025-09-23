
"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import type { Challenge } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { NewProjectModal } from "./ide/new-project-modal";
import { AiAssistantModal } from "./ai-assistant-modal";
import { FileSystemNode, TestResult, initialFiles, initialTestResults } from "@/lib/ide-data";
import { IdeTopBar } from "./ide/ide-top-bar";
import { FileExplorer } from "./ide/file-explorer";
import { EditorPanel } from "./ide/editor-panel";
import { RightPanel } from "./ide/right-panel";
import { IdeStatusBar } from "./ide/ide-status-bar";
import { SettingsModal, type IdeSettings } from "./ide/settings-modal";
import { CommandPalette } from "./ide/command-palette";
import { CreateFileModal } from "./ide/create-file-modal";
import { CreateFolderModal } from "./ide/create-folder-modal";
import { ContextMenu } from "./ide/context-menu";
import { RenameNodeModal } from "./ide/rename-node-modal";
import { Ban, ClipboardPaste, Copy, CopyPlus, Edit, FileCog, FilePlus2, Folder, Play, Scissors, Search, Trash2 } from "lucide-react";
import type { editor } from "monaco-editor";

const usePersistentState = <T,>(key: string, defaultValue: T): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  });

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving state for key "${key}":`, error);
    }
  };

  return [state, setValue];
};

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

const addNode = (tree: FileSystemNode, path: string, type: 'file' | 'folder'): FileSystemNode => {
    const parts = path.split('/').filter(p => p);
    let currentNode = tree;

    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        let childNode = currentNode.children?.find(c => c.name === part);
        if (childNode && childNode.type === 'folder') {
            currentNode = childNode;
        } else {
            console.error("Invalid path");
            return tree; // Path is invalid
        }
    }

    const newNodeName = parts[parts.length - 1];
    if (currentNode.children?.some(c => c.name === newNodeName)) {
        return tree; // Node already exists
    }

    const newNode: FileSystemNode = {
        name: newNodeName,
        type,
        path: (currentNode.path === '/' ? '' : currentNode.path) + '/' + newNodeName,
        children: type === 'folder' ? [] : undefined,
        content: type === 'file' ? '' : undefined,
    };

    currentNode.children = [...(currentNode.children || []), newNode].sort((a,b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
    });
    return { ...tree };
};


export function CodeIdeView({ challenge }: { challenge: Challenge }) {
  const [files, setFiles] = usePersistentState<FileSystemNode>('fileSystem', initialFiles);
  const [openTabs, setOpenTabs] = usePersistentState<string[]>('openTabs', ['/server.js']);
  const [activeTab, setActiveTab] = usePersistentState<string>('activeTab', '/server.js');
  const [openFolders, setOpenFolders] = usePersistentState<Set<string>>('openFolders', new Set(['/']));

  const [testResults, setTestResults] = useState<TestResult[]>(initialTestResults);
  const [selectedFolder, setSelectedFolder] = useState<string>('/');
  
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [createFileModalOpen, setCreateFileModalOpen] = useState(false);
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [settings, setSettings] = usePersistentState<IdeSettings | null>('ideSettings', null);
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  
  // Context Menu State
  const [fileContextMenu, setFileContextMenu] = useState<{ x: number; y: number; path: string } | null>(null);
  const [editorContextMenu, setEditorContextMenu] = useState<{ x: number; y: number; } | null>(null);
  const [clipboard, setClipboard] = useState<{ path: string; operation: 'copy' | 'cut' } | null>(null);
  const [renameModal, setRenameModal] = useState<{ path: string; name: string, type: 'file' | 'folder' } | null>(null);

  const { toast } = useToast();
  
  const activeFileContent = findNode(activeTab, files)?.content ?? '';

  const handleRunCode = async (setActiveRightPanelTab: (tab: string) => void, setTerminalOutput: (updater: (prev: any[]) => any[]) => void) => {
    setIsRunning(true);
    setActiveRightPanelTab("output");
    setTerminalOutput(prev => [...prev, {type: 'command', content: `> node ${activeTab.substring(1)}`}]);
    toast({ title: "Running code..." });

    await new Promise(resolve => setTimeout(resolve, 500));
    setTerminalOutput(prev => [...prev, {type: 'output', content: "Server running on port 3000"}]);
    await new Promise(resolve => setTimeout(resolve, 200));
    setTerminalOutput(prev => [...prev, {type: 'success', content: 'Execution finished successfully.'}]);

    setIsRunning(false);
    toast({ title: "Execution Finished", description: "Check the output panel." });
  };

  const handleSubmit = async (setActiveRightPanelTab: (tab: string) => void) => {
    setIsSubmitting(true);
    setActiveRightPanelTab("tests");
    toast({ title: "Submitting solution", description: "Running all test cases..." });

    setTestResults(prev => prev.map(t => ({...t, status: 'running'})));

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const finalResults: TestResult[] = [
      { name: "Basic server setup", status: 'passed', output: "Completed" },
      { name: "JWT implementation", status: 'passed', output: "Completed" },
      { name: "Login endpoint", status: 'passed', output: "Completed" },
      { name: "Protected routes", status: 'passed', output: "Completed" },
      { name: "Error handling", status: 'failed', output: "Missing error handling for expired tokens" },
    ];
    setTestResults(finalResults);
    setIsSubmitting(false);

    const passedCount = finalResults.filter(r => r.status === 'passed').length;
    toast({ title: "Tests finished", description: `${passedCount} out of 5 tests passed.` });
  };
  
  const handleCodeChange = (newCode: string) => {
      const updateContent = (node: FileSystemNode): FileSystemNode => {
          if (!node) return node;
          if (node.path === activeTab) {
              return { ...node, content: newCode };
          }
          if (node.children) {
              return { ...node, children: node.children.map(updateContent) };
          }
          return node;
      };
      setFiles(updateContent(files));
  }

  const handleFileSelect = (path: string) => {
    const node = findNode(path, files);
    if (!node) return;

    if (node.type === 'file') {
      if (!openTabs.includes(path)) {
        setOpenTabs([...openTabs, path]);
      }
      setActiveTab(path);
    } else if (node.type === 'folder') {
      setSelectedFolder(path);
      toggleFolder(path);
    }
  }

  const handleCloseTab = (path: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const newTabs = openTabs.filter(t => t !== path);
      setOpenTabs(newTabs);
      if (activeTab === path) {
          setActiveTab(newTabs.length > 0 ? newTabs[0] : '');
      }
  }

  const executeCommand = (command: string) => {
    switch (command) {
      case 'newProject':
        setNewProjectModalOpen(true);
        break;
      case 'openSettings':
        setSettingsModalOpen(true);
        break;
      case 'createFile':
        setCreateFileModalOpen(true);
        break;
      case 'createFolder':
        setCreateFolderModalOpen(true);
        break;
      default:
        toast({ title: "Command not recognized", variant: "destructive" });
    }
    setCommandPaletteOpen(false);
  }
  
  useEffect(() => {
    const handleGlobalClick = () => {
        setFileContextMenu(null);
        setEditorContextMenu(null);
    };
    window.addEventListener('click', handleGlobalClick);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(v => !v);
      }
       if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setSettingsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const onSettingsChange = (newSettings: IdeSettings) => {
    setSettings(newSettings);
    // Settings are applied via useEffect in EditorPanel
  };
  
  const handleCreateFile = (name: string) => {
      if (!name || !name.includes('.')) {
          toast({ variant: 'destructive', title: 'Invalid File Name', description: 'Please provide a valid file name with an extension.'});
          return;
      }
      const path = (selectedFolder === '/' ? '' : selectedFolder) + '/' + name;
      setFiles(addNode(files, path, 'file'));
      handleFileSelect(path);
      toast({ title: "File created!", description: `File "${path}" was created successfully.` });
      setCreateFileModalOpen(false);
  }

  const handleCreateFolder = (name: string) => {
       if (!name || name.includes('.')) {
          toast({ variant: 'destructive', title: 'Invalid Folder Name', description: 'Please provide a valid folder name.'});
          return;
      }
      const path = (selectedFolder === '/' ? '' : selectedFolder) + '/' + name;
      setFiles(addNode(files, path, 'folder'));
      toast({ title: "Folder created!", description: `Folder "${path}" was created successfully.` });
      setCreateFolderModalOpen(false);
  }
  
  const handleRefresh = () => {
    setFiles({...files}); // simple trick to force re-render
    toast({ title: "File explorer refreshed" });
  }

  const handleCollapseAll = () => {
    setOpenFolders(new Set(['/'])); // Only root is open
    toast({ title: "All folders collapsed" });
  };

  const handleExpandAll = () => {
      const allFolderPaths = new Set<string>();
      const recurse = (node: FileSystemNode) => {
          if (node.type === 'folder') {
              allFolderPaths.add(node.path);
              node.children?.forEach(recurse);
          }
      };
      recurse(files);
      setOpenFolders(allFolderPaths);
      toast({ title: "All folders expanded" });
  };

  const toggleFolder = (path: string) => {
      setOpenFolders(prev => {
        const newSet = new Set(prev);
        if (newSet.has(path)) {
          newSet.delete(path);
        } else {
          newSet.add(path);
        }
        return newSet;
      });
  };

  const onFileContextMenu = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFileContextMenu({ x: e.clientX, y: e.clientY, path });
    setEditorContextMenu(null);
    
    // Also select the folder being right-clicked
    const node = findNode(path, files);
    if(node?.type === 'folder') {
        setSelectedFolder(path);
    } else if (node?.type === 'file') {
        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        setSelectedFolder(parentPath);
    }
  };

  const onEditorContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditorContextMenu({ x: e.clientX, y: e.clientY });
    setFileContextMenu(null);
  }

  // --- Context Menu Actions ---
    const deleteNode = (path: string) => {
        const deleteRecursively = (node: FileSystemNode, targetPath: string): FileSystemNode | null => {
            if (!node) return null;
            if (node.path === targetPath) {
                return null;
            }
            if (node.children) {
                const newChildren = node.children
                    .map(child => deleteRecursively(child, targetPath))
                    .filter(Boolean) as FileSystemNode[];
                return { ...node, children: newChildren };
            }
            return node;
        };
        const newFiles = deleteRecursively(files, path)!;
        setFiles(newFiles);

        const newTabs = openTabs.filter(t => !t.startsWith(path));
        setOpenTabs(newTabs);

        if (activeTab.startsWith(path)) {
            setActiveTab(newTabs.length > 0 ? newTabs[0] : '');
        }
        toast({ title: `Deleted "${path}"` });
    };

    const renameNode = (oldPath: string, newName: string) => {
        if (!newName || newName.includes('/')) {
            toast({ variant: 'destructive', title: "Invalid Name" });
            return;
        }

        let newPath = '';
        const renameRecursively = (node: FileSystemNode, targetPath: string, newName: string): FileSystemNode => {
            if (!node) return node;
            if (node.path === targetPath) {
                newPath = targetPath.substring(0, targetPath.lastIndexOf('/') + 1) + newName;
                return { ...node, name: newName, path: newPath }; 
            }
            if (node.children) {
                return { ...node, children: node.children.map(child => renameRecursively(child, targetPath, newName)) };
            }
            return node;
        };

        const newFiles = renameRecursively(files, oldPath, newName);
        setFiles(newFiles);
        setRenameModal(null);
        
        // Update tabs if a renamed file was open
        const newTabs = openTabs.map(tab => tab === oldPath ? newPath : tab);
        setOpenTabs(newTabs);
        if (activeTab === oldPath) {
            setActiveTab(newPath);
        }

        toast({ title: `Renamed to "${newName}"` });
    };
    
    const duplicateNode = (path: string) => {
        const nodeToCopy = findNode(path, files);
        if (!nodeToCopy) return;

        let newName;
        const parts = nodeToCopy.name.split('.');
        if (parts.length > 1) {
            const ext = parts.pop();
            newName = `${parts.join('.')}-copy.${ext}`;
        } else {
            newName = `${nodeToCopy.name}-copy`;
        }
        
        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        const newPath = parentPath === '/' ? `/${newName}` : `${parentPath}/${newName}`;

        const addRecursively = (node: FileSystemNode, targetPath: string, newNode: FileSystemNode): FileSystemNode => {
            if (!node) return node;
            if (node.path === targetPath) {
                 if (node.children?.some(c => c.name === newNode.name)) {
                     toast({ variant: 'destructive', title: "A file/folder with that name already exists in this directory." });
                     return node;
                }
                return { ...node, children: [...(node.children || []), newNode] };
            }
             if (node.children) {
                return { ...node, children: node.children.map(child => addRecursively(child, targetPath, newNode)) };
            }
            return node;
        };
        
        const newNode = { ...nodeToCopy, name: newName, path: newPath };
        setFiles(addRecursively(files, parentPath, newNode));
        toast({ title: `Duplicated to "${newName}"` });
    };

    const handlePaste = (destinationPath: string) => {
        if (!clipboard) {
            toast({ variant: 'destructive', title: "Clipboard is empty" });
            return;
        }

        const nodeToPaste = findNode(clipboard.path, files);
        if (!nodeToPaste) return;

        const newName = nodeToPaste.name;
        const newPath = `${destinationPath === '/' ? '' : destinationPath}/${newName}`;
        
        let fileTree = files;

        const addRecursively = (node: FileSystemNode, targetPath: string, newNode: FileSystemNode): FileSystemNode => {
            if (!node) return node;
            if (node.path === targetPath) {
                if (node.children?.find(c => c.name === newNode.name)) {
                     toast({ variant: 'destructive', title: "A file with that name already exists." });
                     return node; // abort
                }
                return { ...node, children: [...(node.children || []), { ...newNode, path: newPath }] };
            }
             if (node.children) {
                return { ...node, children: node.children.map(child => addRecursively(child, targetPath, newNode)) };
            }
            return node;
        };

        if (clipboard.operation === 'cut') {
            const deleteRecursively = (node: FileSystemNode, targetPath: string): FileSystemNode | null => {
                if (!node) return null;
                if (node.path === targetPath) return null;
                if (node.children) {
                    const newChildren = node.children
                        .map(child => deleteRecursively(child, targetPath))
                        .filter(Boolean) as FileSystemNode[];
                    return { ...node, children: newChildren };
                }
                return node;
            };
            fileTree = deleteRecursively(fileTree, clipboard.path)!;
        }
        
        fileTree = addRecursively(fileTree, destinationPath, nodeToPaste);
        setFiles(fileTree);
        toast({ title: `Pasted "${newName}"` });
        setClipboard(null);
    };

    const getFileContextMenuItems = (): any[] => {
        if (!fileContextMenu) return [];
        const node = findNode(fileContextMenu.path, files);
        if (!node) return [];

        const isFolder = node.type === 'folder';

        return [
            { label: "New File", icon: <FilePlus2 className="h-4 w-4" />, action: () => setCreateFileModalOpen(true), disabled: !isFolder },
            { label: "New Folder", icon: <Folder className="h-4 w-4" />, action: () => setCreateFolderModalOpen(true), disabled: !isFolder, separator: true },
            { label: "Cut", icon: <Scissors className="h-4 w-4" />, action: () => setClipboard({ path: fileContextMenu.path, operation: 'cut' }) },
            { label: "Copy", icon: <Copy className="h-4 w-4" />, action: () => setClipboard({ path: fileContextMenu.path, operation: 'copy' }) },
            { label: "Paste", icon: <ClipboardPaste className="h-4 w-4" />, action: () => handlePaste(isFolder ? fileContextMenu.path : (fileContextMenu.path.substring(0, fileContextMenu.path.lastIndexOf('/')) || '/')), disabled: !clipboard, separator: true },
            { label: "Duplicate", icon: <CopyPlus className="h-4 w-4" />, action: () => duplicateNode(fileContextMenu.path) },
            { label: "Rename", icon: <Edit className="h-4 w-4" />, action: () => setRenameModal({ path: node.path, name: node.name, type: node.type }), separator: true },
            { label: "Delete", icon: <Trash2 className="h-4 w-4" />, action: () => deleteNode(fileContextMenu.path), isDestructive: true },
        ];
    };

    const handleFind = () => editorInstanceRef.current?.trigger('find', 'actions.find', null);
    const handleFormat = () => editorInstanceRef.current?.getAction('editor.action.formatDocument')?.run();
    const handleRun = () => {
        const rightPanel = document.querySelector<any>('[data-right-panel-ref]');
        if (rightPanel) rightPanel.runCode();
    };

    const getEditorContextMenuItems = (): any[] => {
        if (!editorContextMenu) return [];
        return [
            { label: "Run", icon: <Play className="h-4 w-4"/>, action: handleRun },
            { label: "Find & Replace", icon: <Search className="h-4 w-4"/>, action: handleFind, separator: true },
            { label: "Format Document", icon: <FileCog className="h-4 w-4"/>, action: handleFormat },
            { label: "Block", icon: <Ban className="h-4 w-4"/>, action: () => toast({title: "Coming Soon!", description: "This feature is under development."}), disabled: true, separator: true },
            { label: "Cut", icon: <Scissors className="h-4 w-4" />, action: () => document.execCommand('cut') },
            { label: "Copy", icon: <Copy className="h-4 w-4" />, action: () => document.execCommand('copy') },
            { label: "Paste", icon: <ClipboardPaste className="h-4 w-4" />, action: () => navigator.clipboard.readText().then(text => editorInstanceRef.current?.trigger('paste', 'paste', { text }))},
        ];
    };


  return (
    <>
      <Script src="https://unpkg.com/monaco-editor@0.44.0/min/vs/loader.js" />
      <AiAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
      <NewProjectModal isOpen={newProjectModalOpen} onClose={() => setNewProjectModalOpen(false)} />
      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)}
        onSettingsChange={onSettingsChange}
        initialSettings={settings}
      />
      <CommandPalette isOpen={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} onCommand={executeCommand} />
      <CreateFileModal isOpen={createFileModalOpen} onClose={() => setCreateFileModalOpen(false)} onCreate={handleCreateFile} basePath={selectedFolder} />
      <CreateFolderModal isOpen={createFolderModalOpen} onClose={() => setCreateFolderModalOpen(false)} onCreate={handleCreateFolder} basePath={selectedFolder} />
       {renameModal && (
        <RenameNodeModal
          isOpen={!!renameModal}
          onClose={() => setRenameModal(null)}
          onRename={(newName) => renameNode(renameModal.path, newName)}
          currentNodeName={renameModal.name}
          nodeType={renameModal.type}
        />
      )}
      {fileContextMenu && <ContextMenu x={fileContextMenu.x} y={fileContextMenu.y} items={getFileContextMenuItems()} onClose={() => setFileContextMenu(null)} />}
      {editorContextMenu && <ContextMenu x={editorContextMenu.x} y={editorContextMenu.y} items={getEditorContextMenuItems()} onClose={() => setEditorContextMenu(null)} />}


      <div className="h-screen w-screen flex flex-col bg-background ide-body" onClick={() => { setFileContextMenu(null); setEditorContextMenu(null); }} onContextMenu={(e) => onFileContextMenu(e, '/')}>
        <IdeTopBar 
          challenge={challenge}
          onNewProject={() => setNewProjectModalOpen(true)}
          onAiClick={() => setAiModalOpen(true)}
          onSettingsClick={() => setSettingsModalOpen(true)}
          onRunCode={() => {
            const rightPanel = document.querySelector<any>('[data-right-panel-ref]');
            if (rightPanel) rightPanel.runCode();
          }}
          onSubmit={() => {
             const rightPanel = document.querySelector<any>('[data-right-panel-ref]');
            if (rightPanel) rightPanel.submit();
          }}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
        />
        
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="flex-1">
              <ResizablePanel defaultSize={18} minSize={15} maxSize={30} className="hidden md:block ide-sidebar">
                  <FileExplorer
                      files={files}
                      activeTab={activeTab}
                      onFileSelect={handleFileSelect}
                      testResults={testResults}
                      onNewFile={() => setCreateFileModalOpen(true)}
                      onNewFolder={() => setCreateFolderModalOpen(true)}
                      onRefresh={handleRefresh}
                      onCollapseAll={handleCollapseAll}
                      onExpandAll={handleExpandAll}
                      openFolders={openFolders}
                      toggleFolder={toggleFolder}
                      selectedFolder={selectedFolder}
                      onContextMenu={onFileContextMenu}
                  />
              </ResizablePanel>
              <ResizableHandle withHandle className="hidden md:flex"/>
            
            <ResizablePanel className="flex-1 flex flex-col">
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={65} minSize={25} className="relative flex flex-col">
                  <EditorPanel
                      openTabs={openTabs}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      onCloseTab={handleCloseTab}
                      files={files}
                      onCodeChange={handleCodeChange}
                      editorSettings={settings}
                      onContextMenu={onEditorContextMenu}
                      onEditorReady={(editor) => editorInstanceRef.current = editor}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35} minSize={20}>
                  <RightPanel
                      testResults={testResults}
                      files={files}
                      handleRunCode={handleRunCode}
                      handleSubmit={handleSubmit}
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <IdeStatusBar editor={editorInstanceRef.current}/>
      </div>
    </>
  );
}

    