
"use client";

import { useState, useEffect, useRef } from "react";
import type { Challenge } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import type { Panel } from "react-resizable-panels";
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

const usePersistentState = <T,>(key: string, defaultValue: T): [T, (value: T | ((prevState: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return defaultValue;
      }
      const storedValue = localStorage.getItem(key);
      const parsed = storedValue ? JSON.parse(storedValue) : defaultValue;
      
      // Ensure openFolders is always an array
      if (key === 'openFolders' && !Array.isArray(parsed)) {
        return Array.isArray(defaultValue) ? defaultValue : [];
      }

      return parsed;

    } catch (error) {
      return defaultValue;
    }
  });

  const setValue = (value: T | ((prevState: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
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

const addNodeToTree = (tree: FileSystemNode, basePath: string, name: string, type: 'file' | 'folder'): FileSystemNode => {
    const path = basePath === '/' ? `/${name}` : `${basePath}/${name}`;
    const parts = basePath.split('/').filter(p => p);
    let currentNode = tree;

    for (const part of parts) {
        let childNode = currentNode.children?.find(c => c.name === part);
        if (childNode && childNode.type === 'folder') {
            currentNode = childNode;
        } else {
            console.error("Invalid path");
            return tree; // Path is invalid
        }
    }

    if (currentNode.children?.some(c => c.name === name)) {
        return tree; // Node already exists
    }

    const newNode: FileSystemNode = {
        name,
        type,
        path,
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
  const [openFolders, setOpenFolders] = usePersistentState<string[]>('openFolders', ['/']);
  const [currentWorkingDirectory, setCurrentWorkingDirectory] = usePersistentState<string>('cwd', '/');

  const [testResults, setTestResults] = useState<TestResult[]>(initialTestResults);
  
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [createFileModalOpen, setCreateFileModalOpen] = useState(false);
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [settings, setSettings] = usePersistentState<IdeSettings>('ideSettings', {
    geminiApiKey: "",
    theme: "vs-dark",
    fontSize: 14,
    tabSize: 4,
    autoSave: true,
    minimap: true,
    wordWrap: true,
  });
  const editorInstanceRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  
  const [fileContextMenu, setFileContextMenu] = useState<{ x: number; y: number; path: string } | null>(null);
  const [editorContextMenu, setEditorContextMenu] = useState<{ x: number; y: number; } | null>(null);
  const [clipboard, setClipboard] = useState<{ path: string; operation: 'copy' | 'cut' } | null>(null);
  const [renameModal, setRenameModal] = useState<{ path: string; name: string, type: 'file' | 'folder' } | null>(null);

  const { toast } = useToast();
  
  const rightPanelRef = useRef<Panel>(null);
  const filePanelRef = useRef<Panel>(null);
  const rightPanelLastSize = useRef<number>(35);

  const handleRunCode = async (setActiveRightPanelTab: (tab: string) => void) => {
    setIsRunning(true);
    setActiveRightPanelTab("output");
    toast({ title: "Running code..." });

    await new Promise(resolve => setTimeout(resolve, 500));
    
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
      setFiles((prevFiles) => {
        const updateContent = (node: FileSystemNode): FileSystemNode => {
            if (node.path === activeTab) {
                return { ...node, content: newCode };
            }
            if (node.children) {
                return { ...node, children: node.children.map(updateContent) };
            }
            return node;
        };
        return updateContent(prevFiles);
      });
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
      toggleFolder(path);
    }
  }

  const handleCloseTab = (path: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setOpenTabs(prev => {
        const newTabs = prev.filter(t => t !== path);
        if (activeTab === path) {
          setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1] : '');
        }
        return newTabs;
      });
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
  
  const runCodeAction = () => {
    const rightPanel = document.querySelector<any>('[data-right-panel-ref]');
    if (rightPanel) rightPanel.runCode();
  };

  const submitAction = () => {
    const rightPanel = document.querySelector<any>('[data-right-panel-ref]');
    if (rightPanel) rightPanel.submit();
  };

  useEffect(() => {
    const handleGlobalClick = () => {
        setFileContextMenu(null);
        setEditorContextMenu(null);
    };
    window.addEventListener('click', handleGlobalClick);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            if (e.shiftKey) {
              e.preventDefault();
              setCommandPaletteOpen(v => !v);
            }
            break;
          case ',':
            e.preventDefault();
            setSettingsModalOpen(true);
            break;
          case 'j':
            e.preventDefault();
            if (rightPanelRef.current) {
                if (rightPanelRef.current.getSize() > 5) {
                    rightPanelLastSize.current = rightPanelRef.current.getSize();
                    rightPanelRef.current.resize(0);
                } else {
                    rightPanelRef.current.resize(rightPanelLastSize.current);
                }
            }
            break;
          case 'b':
            e.preventDefault();
            if (filePanelRef.current) {
              filePanelRef.current.isCollapsed() ? filePanelRef.current.expand() : filePanelRef.current.collapse();
            }
            break;
          case 'enter':
             if (e.ctrlKey || e.metaKey) {
                 e.preventDefault();
                 submitAction();
             }
             break;
        }
      } else if (e.key === 'F5') {
          e.preventDefault();
          runCodeAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSettingsChange = (newSettings: IdeSettings) => {
    setSettings(newSettings);
  };
  
  const handleCreateFile = (name: string) => {
      const selectedFolder = findNode(currentWorkingDirectory, files);
      if (!name || !name.includes('.') || !selectedFolder || selectedFolder.type !== 'folder') {
          toast({ variant: 'destructive', title: 'Invalid Operation', description: 'Please provide a valid file name and ensure a folder is selected.'});
          return;
      }
      const path = (currentWorkingDirectory === '/' ? '' : currentWorkingDirectory) + '/' + name;
      setFiles(prev => addNodeToTree(prev, currentWorkingDirectory, name, 'file'));
      handleFileSelect(path);
      toast({ title: "File created!", description: `File "${path}" was created successfully.` });
      setCreateFileModalOpen(false);
  }

  const handleCreateFolder = (name: string) => {
       const selectedFolder = findNode(currentWorkingDirectory, files);
       if (!name || name.includes('.') || !selectedFolder || selectedFolder.type !== 'folder') {
          toast({ variant: 'destructive', title: 'Invalid Operation', description: 'Please provide a valid folder name and ensure a folder is selected.'});
          return;
      }
      const path = (currentWorkingDirectory === '/' ? '' : currentWorkingDirectory) + '/' + name;
      setFiles(prev => addNodeToTree(prev, currentWorkingDirectory, name, 'folder'));
      toast({ title: "Folder created!", description: `Folder "${path}" was created successfully.` });
      setCreateFolderModalOpen(false);
  }
  
  const handleRefresh = () => {
    setFiles({...files}); // simple trick to force re-render
    toast({ title: "File explorer refreshed" });
  }

  const handleCollapseAll = () => {
    setOpenFolders(['/']); // Only root is open
    toast({ title: "All folders collapsed" });
  };

  const handleExpandAll = () => {
      const allFolderPaths: string[] = [];
      const recurse = (node: FileSystemNode) => {
          if (node.type === 'folder') {
              allFolderPaths.push(node.path);
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
        return Array.from(newSet);
      });
  };

  const onFileContextMenu = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFileContextMenu({ x: e.clientX, y: e.clientY, path });
    setEditorContextMenu(null);
    
    const node = findNode(path, files);
    if(node?.type === 'folder') {
        setCurrentWorkingDirectory(path);
    } else if (node?.type === 'file') {
        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        setCurrentWorkingDirectory(parentPath);
    }
  };

  const onEditorContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditorContextMenu({ x: e.clientX, y: e.clientY });
    setFileContextMenu(null);
  }

    const deleteNode = (path: string) => {
        setFiles(prevFiles => {
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
            return deleteRecursively(prevFiles, path)!;
        });

        setOpenTabs(prevTabs => {
            const newTabs = prevTabs.filter(t => !t.startsWith(path));
            if (activeTab.startsWith(path)) {
                setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1] : '');
            }
            return newTabs;
        });
        toast({ title: `Deleted "${path}"` });
    };

    const renameNode = (oldPath: string, newName: string) => {
        if (!newName || newName.includes('/')) {
            toast({ variant: 'destructive', title: "Invalid Name" });
            return;
        }

        const parentPath = oldPath.substring(0, oldPath.lastIndexOf('/')) || '/';
        const newPath = parentPath === '/' ? `/${newName}` : `${parentPath}/${newName}`;

        // Check if a node with the new name already exists in the parent
        const parentNode = findNode(parentPath, files);
        if (parentNode?.children?.some(child => child.name === newName)) {
            toast({ variant: 'destructive', title: "A file or folder with that name already exists." });
            setRenameModal(null);
            return;
        }

        setFiles(prevFiles => {
            const updatePaths = (node: FileSystemNode, oldP: string, newP: string): FileSystemNode => {
                const updatedPath = node.path.startsWith(oldP) ? node.path.replace(oldP, newP) : node.path;
                return {
                    ...node,
                    path: updatedPath,
                    children: node.children ? node.children.map(child => updatePaths(child, oldP, newP)) : undefined,
                };
            };

            const renameRecursively = (node: FileSystemNode): FileSystemNode => {
                if (node.path === oldPath) {
                    const renamedNode = { ...node, name: newName };
                    return updatePaths(renamedNode, oldPath, newPath);
                }

                if (node.children) {
                    return { ...node, children: node.children.map(renameRecursively) };
                }

                return node;
            };

            return renameRecursively(prevFiles);
        });

        setOpenTabs(prev => prev.map(tab => tab.startsWith(oldPath) ? tab.replace(oldPath, newPath) : tab));
        if (activeTab.startsWith(oldPath)) {
           setActiveTab(prev => prev.replace(oldPath, newPath));
        }
        if (openFolders.some(f => f.startsWith(oldPath))) {
            setOpenFolders(prev => prev.map(f => f.startsWith(oldPath) ? f.replace(oldPath, newPath) : f));
        }
        toast({title: `Renamed to "${newName}"`});
        setRenameModal(null);
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

        const addRecursively = (tree: FileSystemNode, destinationPath: string, nodeToAdd: FileSystemNode, newName: string): FileSystemNode => {
            let pathExists = true;
            let counter = 1;
            let finalName = newName;
            
            while(pathExists) {
                const parentNode = findNode(destinationPath, tree);
                if (!parentNode?.children?.some(c => c.name === finalName)) {
                    pathExists = false;
                } else {
                    const baseName = newName.includes('-copy') ? newName.substring(0, newName.lastIndexOf('-copy')) : newName;
                    finalName = `${baseName}-copy-${counter++}`;
                }
            }
            
            const newPath = destinationPath === '/' ? `/${finalName}` : `${destinationPath}/${finalName}`;

            const updatePaths = (node: FileSystemNode, oldPath: string, newPath: string): FileSystemNode => {
                 const updatedPath = node.path.replace(oldPath, newPath);
                 return {
                    ...node,
                    path: updatedPath,
                    children: node.children ? node.children.map(child => updatePaths(child, node.path, updatedPath)) : undefined,
                 }
            }

            const newNode = updatePaths(JSON.parse(JSON.stringify({ ...nodeToAdd, name: finalName })), nodeToAdd.path, newPath);

            return addNodeToTree(tree, destinationPath, newNode.name, newNode.type);
        };
        
        setFiles(prev => addRecursively(prev, parentPath, nodeToCopy, newName));
        toast({ title: `Duplicated to "${newName}"` });
    };

    const handlePaste = (destinationPath: string) => {
        if (!clipboard) {
            toast({ variant: 'destructive', title: "Clipboard is empty" });
            return;
        }

        const nodeToPaste = findNode(clipboard.path, files);
        if (!nodeToPaste) return;

        const destNode = findNode(destinationPath, files);
        if (!destNode || destNode.type !== 'folder') {
            toast({ variant: 'destructive', title: "Invalid paste location" });
            return;
        }

        const newName = nodeToPaste.name;
        
        let fileTree = { ...files };

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
        
        setFiles(addNodeToTree(fileTree, destinationPath, newName, nodeToPaste.type));
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
            { label: "Rename", icon: <Edit className="h-4 w-4" />, action: () => setRenameModal({path: node.path, name: node.name, type: node.type}), separator: true },
            { label: "Delete", icon: <Trash2 className="h-4 w-4" />, action: () => deleteNode(fileContextMenu.path), isDestructive: true },
        ];
    };

    const handleFind = () => editorInstanceRef.current?.trigger('find', 'actions.find', null);
    const handleFormat = () => editorInstanceRef.current?.getAction('editor.action.formatDocument')?.run();
    const handleRun = () => runCodeAction();

    const getEditorContextMenuItems = (): any[] => {
        if (!editorContextMenu) return [];
        return [
            { label: "Run", icon: <Play className="h-4 w-4"/>, action: handleRun },
            { label: "Find & Replace", icon: <Search className="h-4 w-4"/>, action: handleFind, separator: true },
            { label: "Format Document", icon: <FileCog className="h-4 w-4"/>, action: handleFormat },
            { label: "Block", icon: <Ban className="h-4 w-4"/>, action: () => toast({title: "Coming Soon!", description: "This feature is under development."}), disabled: true, separator: true },
            { label: "Cut", icon: <Scissors className="h-4 w-4" />, action: () => document.execCommand('cut') },
            { label: "Copy", icon: <Copy className="h-4 w-4" />, action: () => document.execCommand('copy') },
            { label: "Paste", icon: <ClipboardPaste className="h-4 w-4" />, action: async () => {
                try {
                    const text = await navigator.clipboard.readText();
                    editorInstanceRef.current?.trigger('paste', 'paste', { text });
                } catch(e) {
                    console.error("Failed to paste from clipboard", e);
                }
            }},
        ];
    };


  return (
    <>
      <AiAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
      <NewProjectModal isOpen={newProjectModalOpen} onClose={() => setNewProjectModalOpen(false)} />
      <SettingsModal 
        isOpen={settingsModalOpen} 
        onClose={() => setSettingsModalOpen(false)}
        onSettingsChange={onSettingsChange}
        initialSettings={settings}
      />
      <CommandPalette isOpen={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} onCommand={executeCommand} />
      <CreateFileModal isOpen={createFileModalOpen} onClose={() => setCreateFileModalOpen(false)} onCreate={handleCreateFile} basePath={currentWorkingDirectory} />
      <CreateFolderModal isOpen={createFolderModalOpen} onClose={() => setCreateFolderModalOpen(false)} onCreate={handleCreateFolder} basePath={currentWorkingDirectory} />
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
          onRunCode={runCodeAction}
          onSubmit={submitAction}
          isRunning={isRunning}
          isSubmitting={isSubmitting}
        />
        
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="flex-1">
              <ResizablePanel ref={filePanelRef} defaultSize={18} minSize={15} maxSize={30} collapsible className="hidden md:block ide-sidebar">
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
                      selectedFolder={currentWorkingDirectory}
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
                <ResizablePanel ref={rightPanelRef} defaultSize={35} minSize={10}>
                  <RightPanel
                      ref={rightPanelRef as any}
                      testResults={testResults}
                      files={files}
                      handleRunCode={handleRunCode}
                      handleSubmit={handleSubmit}
                      addNode={handleCreateFile}
                      deleteNode={deleteNode}
                      currentWorkingDirectory={currentWorkingDirectory}
                      setCurrentWorkingDirectory={setCurrentWorkingDirectory}
                      onOpenFile={handleFileSelect}
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
