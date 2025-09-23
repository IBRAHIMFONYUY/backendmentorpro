
"use client";

import { useState, useEffect } from "react";
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
import { Copy, CopyPlus, Edit, Folder, ClipboardPaste, Trash2, FilePlus2, Scissors } from "lucide-react";


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
  const [files, setFiles] = useState<FileSystemNode>(initialFiles);
  const [openTabs, setOpenTabs] = useState<string[]>(['/server.js']);
  const [activeTab, setActiveTab] = useState('/server.js');
  const [testResults, setTestResults] = useState<TestResult[]>(initialTestResults);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['/']));
  const [selectedFolder, setSelectedFolder] = useState<string>('/');
  
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [createFileModalOpen, setCreateFileModalOpen] = useState(false);
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<IdeSettings | null>(null);
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; path: string } | null>(null);
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
        setOpenTabs(prev => [...prev, path]);
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
    const handleGlobalClick = () => setContextMenu(null);
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
    // Here you would apply settings to the Monaco editor instance
    // For example: editorRef.current?.updateOptions({ fontSize: newSettings.fontSize });
    toast({ title: "Settings Updated", description: "Your changes have been applied." });
  };
  
  const handleCreateFile = (name: string) => {
      if (!name || !name.includes('.')) {
          toast({ variant: 'destructive', title: 'Invalid File Name', description: 'Please provide a valid file name with an extension.'});
          return;
      }
      const path = (selectedFolder === '/' ? '' : selectedFolder) + '/' + name;
      setFiles(prevFiles => addNode(prevFiles, path, 'file'));
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
      setFiles(prevFiles => addNode(prevFiles, path, 'folder'));
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

  const onContextMenu = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, path });
    
    // Also select the folder being right-clicked
    const node = findNode(path, files);
    if(node?.type === 'folder') {
        setSelectedFolder(path);
    } else if (node?.type === 'file') {
        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        setSelectedFolder(parentPath);
    }
  };

  // --- Context Menu Actions ---
    const deleteNode = (path: string) => {
        const deleteRecursively = (node: FileSystemNode, targetPath: string): FileSystemNode | null => {
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
        setFiles(prevFiles => deleteRecursively(prevFiles, path)!);
        setOpenTabs(prev => prev.filter(t => !t.startsWith(path)));
        if (activeTab.startsWith(path)) {
            setActiveTab(openTabs[0] || '');
        }
        toast({ title: `Deleted "${path}"` });
    };

    const renameNode = (oldPath: string, newName: string) => {
        if (!newName || newName.includes('/')) {
            toast({ variant: 'destructive', title: "Invalid Name" });
            return;
        }

        const renameRecursively = (node: FileSystemNode, targetPath: string, newName: string): FileSystemNode => {
            if (node.path === targetPath) {
                const newPath = targetPath.substring(0, targetPath.lastIndexOf('/') + 1) + newName;
                // A more robust solution would update paths of all children recursively
                return { ...node, name: newName, path: newPath }; 
            }
            if (node.children) {
                return { ...node, children: node.children.map(child => renameRecursively(child, targetPath, newName)) };
            }
            return node;
        };

        setFiles(prevFiles => renameRecursively(prevFiles, oldPath, newName));
        setRenameModal(null);
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
        setFiles(prevFiles => addRecursively(prevFiles, parentPath, newNode));
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

        // Simplified paste: just copy
        const addRecursively = (node: FileSystemNode, targetPath: string, newNode: FileSystemNode): FileSystemNode => {
            if (node.path === targetPath) {
                if (node.children?.find(c => c.name === newNode.name)) {
                     toast({ variant: 'destructive', title: "A file with that name already exists." });
                     return node; // abort
                }
                return { ...node, children: [...(node.children || []), newNode] };
            }
             if (node.children) {
                return { ...node, children: node.children.map(child => addRecursively(child, targetPath, newNode)) };
            }
            return node;
        };

        const newNode = { ...nodeToPaste, path: newPath };
        fileTree = addRecursively(fileTree, destinationPath, newNode);

        if (clipboard.operation === 'cut') {
            const deleteRecursively = (node: FileSystemNode, targetPath: string): FileSystemNode | null => {
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
        
        setFiles(fileTree);
        toast({ title: `Pasted "${newName}"` });
        setClipboard(null);
    };

    const getContextMenuItems = (): any[] => {
        if (!contextMenu) return [];
        const node = findNode(contextMenu.path, files);
        if (!node) return [];

        const isFolder = node.type === 'folder';

        return [
            { label: "New File", icon: <FilePlus2/>, action: () => setCreateFileModalOpen(true), disabled: !isFolder },
            { label: "New Folder", icon: <Folder/>, action: () => setCreateFolderModalOpen(true), disabled: !isFolder, separator: true },
            { label: "Cut", icon: <Scissors />, action: () => setClipboard({ path: contextMenu.path, operation: 'cut' }) },
            { label: "Copy", icon: <Copy />, action: () => setClipboard({ path: contextMenu.path, operation: 'copy' }) },
            { label: "Paste", icon: <ClipboardPaste />, action: () => handlePaste(isFolder ? contextMenu.path : (contextMenu.path.substring(0, contextMenu.path.lastIndexOf('/')) || '/')), disabled: !clipboard, separator: true },
            { label: "Duplicate", icon: <CopyPlus />, action: () => duplicateNode(contextMenu.path) },
            { label: "Rename", icon: <Edit />, action: () => setRenameModal({ path: node.path, name: node.name, type: node.type }), separator: true },
            { label: "Delete", icon: <Trash2 />, action: () => deleteNode(contextMenu.path), isDestructive: true },
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
      {contextMenu && <ContextMenu x={contextMenu.x} y={contextMenu.y} items={getContextMenuItems()} onClose={() => setContextMenu(null)} />}


      <div className="h-screen w-screen flex flex-col bg-background ide-body" onClick={() => setContextMenu(null)} onContextMenu={(e) => onContextMenu(e, '/')}>
        <IdeTopBar 
          challenge={challenge}
          onNewProject={() => setNewProjectModalOpen(true)}
          onAiClick={() => setAiModalOpen(true)}
          onSettingsClick={() => setSettingsModalOpen(true)}
          onRunCode={() => {
            // This is a temporary way to access the panel's functions.
            // A more robust solution would use a ref passed to the component.
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
                      onContextMenu={onContextMenu}
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
        <IdeStatusBar />
      </div>
    </>
  );
}

    