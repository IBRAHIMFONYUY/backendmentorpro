
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Challenge } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import type { Panel } from "react-resizable-panels";
import { NewProjectModal } from "./ide/new-project-modal";
import { AiAssistantModal } from "./ai-assistant-modal";
import { FileSystemNode, TestResult } from "@/lib/ide-types";
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
import { languageMap } from "./ide/editor-panel";
import { reviewChallengeSubmission } from "@/ai/flows/review-challenge-submission";

const usePersistentState = <T,>(key: string, defaultValue: T): [T, (value: T | ((prevState: T) => T)) => void] => {
  const [state, setState] = useState<T>(defaultValue);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
          const parsed = JSON.parse(storedValue);
          // Ensure openFolders is always an array
          if (key.includes('openFolders') && !Array.isArray(parsed)) {
            setState(Array.isArray(defaultValue) ? defaultValue : []);
          } else {
            setState(parsed);
          }
        }
      }
    } catch (error) {
      setState(defaultValue);
    }
  }, [key, defaultValue]);


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

const addNodeToTree = (tree: FileSystemNode, basePath: string, name: string, type: 'file' | 'folder', content = ''): FileSystemNode => {
    const path = basePath === '/' ? `/${name}` : `${basePath}/${name}`;
    let currentNode = findNode(basePath, tree);

    if (!currentNode || currentNode.type !== 'folder') {
        console.error("Invalid base path or not a folder");
        return tree;
    }

    if (currentNode.children?.some(c => c.name === name)) {
        return tree; // Node already exists
    }

    const newNode: FileSystemNode = {
        name,
        type,
        path,
        children: type === 'folder' ? [] : undefined,
        content: type === 'file' ? content : undefined,
    };
    
    const newChildren = [...(currentNode.children || []), newNode].sort((a,b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
    });

    const updateTree = (node: FileSystemNode): FileSystemNode => {
        if (node.path === basePath) {
            return { ...node, children: newChildren };
        }
        if (node.children) {
            return { ...node, children: node.children.map(updateTree) };
        }
        return node;
    }

    return updateTree(tree);
};

type RightPanelRef = {
  runCode: () => void;
  submit: () => void;
  executeCommandInTerminal: (command: string) => void;
  runWithAIDebugger: (code: string, language: string) => void;
};

export function CodeIdeView({ challenge }: { challenge: Challenge }) {
  const [files, setFiles] = usePersistentState<FileSystemNode>(`fileSystem_${challenge.id}`, challenge.fileSystem);
  const [openTabs, setOpenTabs] = usePersistentState<string[]>(`openTabs_${challenge.id}`, ['/README.md', '/server.js']);
  const [activeTab, setActiveTab] = usePersistentState<string>(`activeTab_${challenge.id}`, '/README.md');
  const [openFolders, setOpenFolders] = usePersistentState<string[]>(`openFolders_${challenge.id}`, ['/']);
  const [currentWorkingDirectory, setCurrentWorkingDirectory] = usePersistentState<string>(`cwd_${challenge.id}`, '/');

  const [testResults, setTestResults] = useState<TestResult[]>(challenge.testCases);
  
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

  const augmentedChallenge: Challenge = {
    ...challenge,
    fileSystem: { ...challenge.fileSystem, children: [
        ...(challenge.fileSystem.children || []),
        { name: 'README.md', type: 'file', path: '/README.md', content: challenge.readme }
    ]}
  };
  
  const rightResizablePanelRef = useRef<Panel>(null);
  const filePanelRef = useRef<Panel>(null);
  const rightPanelRef = useRef<RightPanelRef>(null);
  const rightPanelLastSize = useRef<number>(35);

  const handleRunCode = useCallback(async () => {
    if (!activeTab) {
      toast({ variant: 'destructive', title: 'No file selected', description: 'Please select a file to run.' });
      return;
    }
    
    setIsRunning(true);
    rightPanelRef.current?.runCode(); // This just sets the tab, actual logic is here
    toast({ title: `Running ${activeTab}...` });

    const fileToRun = findNode(activeTab, files);
    if (!fileToRun || fileToRun.content === undefined) {
        setIsRunning(false);
        toast({ variant: 'destructive', title: 'File not found or empty.' });
        return;
    }

    const fileExtension = fileToRun.name.split('.').pop() || '';
    
    if (fileExtension === 'js') {
        rightPanelRef.current?.executeCommandInTerminal(`node ${fileToRun.name}`);
    } else {
        const language = languageMap[fileExtension] || fileExtension;
        rightPanelRef.current?.runWithAIDebugger(fileToRun.content, language);
    }
    
    // Simulate a delay for running
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsRunning(false);
    toast({ title: "Execution Finished", description: "Check the output panel." });
  }, [activeTab, files, toast]);

  const serializeFileSystem = (node: FileSystemNode, indent = ''): string => {
    let result = `${indent}${node.name}${node.type === 'folder' ? '/' : ''}\n`;
    if (node.type === 'file' && node.content) {
      const contentIndent = indent + '  ';
      result += "```\n" + node.content.split('\n').map(line => `${contentIndent}${line}`).join('\n') + "\n```\n";
    }
    if (node.children) {
      for (const child of node.children) {
        result += serializeFileSystem(child, indent + '  ');
      }
    }
    return result;
  };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    rightPanelRef.current?.submit();
    toast({ title: "Submitting solution", description: "AI is reviewing your code..." });
    
    setTestResults(prev => prev.map(t => ({...t, status: 'running'})));

    try {
        const filesString = serializeFileSystem(files);
        const result = await reviewChallengeSubmission({
            challengeTitle: challenge.title,
            challengeDescription: challenge.description,
            files: filesString,
        });

        setTestResults(result.results);

        const passedCount = result.results.filter(r => r.status === 'passed').length;
        if (result.overallStatus === 'passed') {
            toast({ title: "Challenge Completed!", description: "Great job! All tests passed." });
        } else {
            toast({ 
                variant: "destructive",
                title: "Tests Failed", 
                description: `${passedCount} out of ${result.results.length} tests passed. Check the test panel for details.` 
            });
        }
    } catch (error) {
        console.error("Submission failed", error);
        toast({ variant: 'destructive', title: "Submission Error", description: "Could not get a response from the AI reviewer." });
        setTestResults(challenge.testCases);
    } finally {
        setIsSubmitting(false);
    }
  }, [challenge.description, challenge.testCases, challenge.title, files, toast]);
  
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
    const node = findNode(path, augmentedChallenge.fileSystem);
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
  
  const runCodeAction = useCallback(() => {
    handleRunCode();
  }, [handleRunCode]);

  const submitAction = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

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
            if (rightResizablePanelRef.current) {
                if (rightResizablePanelRef.current.getSize() > 5) {
                    rightPanelLastSize.current = rightResizablePanelRef.current.getSize();
                    rightResizablePanelRef.current.resize(0);
                } else {
                    rightResizablePanelRef.current.resize(rightPanelLastSize.current);
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
  }, [runCodeAction, submitAction]);

  const onSettingsChange = (newSettings: IdeSettings) => {
    setSettings(newSettings);
  };
  
 const handleCreateFile = (name: string, path: string) => {
      const selectedFolder = findNode(path, files);
      if (!name || !selectedFolder || selectedFolder.type !== 'folder') {
          toast({ variant: 'destructive', title: 'Invalid Operation', description: 'Please provide a valid file name and ensure a folder is selected.'});
          return false;
      }
      const newPath = (path === '/' ? '' : path) + '/' + name;
      setFiles(prev => addNodeToTree(prev, path, name, 'file'));
      handleFileSelect(newPath);
      toast({ title: "File created!", description: `File "${newPath}" was created successfully.` });
      setCreateFileModalOpen(false);
      return true;
  }

  const handleCreateFolder = (name: string, path: string) => {
       const selectedFolder = findNode(path, files);
       if (!name || name.includes('.') || !selectedFolder || selectedFolder.type !== 'folder') {
          toast({ variant: 'destructive', title: 'Invalid Operation', description: 'Please provide a valid folder name and ensure a folder is selected.'});
          return false;
      }
      const newPath = (path === '/' ? '' : path) + '/' + name;
      setFiles(prev => addNodeToTree(prev, path, name, 'folder'));
      toast({ title: "Folder created!", description: `Folder "${newPath}" was created successfully.` });
      setCreateFolderModalOpen(false);
      return true;
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

    const deleteNode = (path: string): boolean => {
        if (path === '/') {
            toast({ variant: 'destructive', title: "Cannot delete root directory." });
            return false;
        }
        if (!findNode(path, files)) return false;

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
        return true;
    };

    const renameNode = (oldPath: string, newName: string) => {
        if (!newName || newName.includes('/')) {
            toast({ variant: 'destructive', title: "Invalid Name" });
            return;
        }

        const parentPath = oldPath.substring(0, oldPath.lastIndexOf('/')) || '/';
        const newPath = parentPath === '/' ? `/${newName}` : `${parentPath}/${newName}`;

        const parentNode = findNode(parentPath, files);
        if (parentNode?.children?.some(child => child.name === newName && child.path !== oldPath)) {
            toast({ variant: 'destructive', title: "A file or folder with that name already exists." });
            setRenameModal(null);
            return;
        }

        setFiles(prevFiles => {
            const updatePaths = (node: FileSystemNode, oldP: string, newP: string): FileSystemNode => {
                const updatedPath = node.path.startsWith(oldP) 
                    ? newP + node.path.substring(oldP.length)
                    : node.path;
                
                return {
                    ...node,
                    path: updatedPath,
                    children: node.children ? node.children.map(child => updatePaths(child, oldP, newP)) : undefined,
                };
            };

            const renameRecursively = (node: FileSystemNode): FileSystemNode => {
                if (node.path === oldPath) {
                    const renamedNode = { ...node, name: newName, path: newPath };
                    return {
                        ...renamedNode,
                        children: renamedNode.children ? renamedNode.children.map(child => updatePaths(child, oldPath, newPath)) : undefined,
                    };
                }

                if (node.children) {
                    return { ...node, children: node.children.map(renameRecursively) };
                }

                return node;
            };

            return renameRecursively(prevFiles);
        });
        
        setOpenTabs(prev => prev.map(tab => tab.startsWith(oldPath) ? newPath + tab.substring(oldPath.length) : tab));
        if (activeTab.startsWith(oldPath)) {
           setActiveTab(prev => newPath + prev.substring(oldPath.length));
        }
        if (openFolders.some(f => f.startsWith(oldPath))) {
            setOpenFolders(prev => prev.map(f => f.startsWith(oldPath) ? newPath + f.substring(oldPath.length) : f));
        }
        toast({title: `Renamed to "${newName}"`});
        setRenameModal(null);
    };
    
    const duplicateNode = (path: string) => {
        const nodeToCopy = findNode(path, files);
        if (!nodeToCopy) return;

        let newName;
        const parts = nodeToCopy.name.split('.');
        const parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        const parentNode = findNode(parentPath, files);

        let counter = 1;
        do {
            const suffix = counter > 1 ? `-copy-${counter}` : '-copy';
            if (parts.length > 1 && nodeToCopy.type === 'file') {
                const ext = parts.pop();
                newName = `${parts.join('.')}${suffix}.${ext}`;
            } else {
                newName = `${nodeToCopy.name}${suffix}`;
            }
            counter++;
        } while(parentNode?.children?.some(c => c.name === newName));

        const addRecursively = (node: FileSystemNode, basePath: string): FileSystemNode => {
            const newNode = { ...node, path: `${basePath}/${node.name}` };
            if (newNode.children) {
                newNode.children = newNode.children.map(child => addRecursively(child, newNode.path));
            }
            return newNode;
        }

        const newTree = JSON.parse(JSON.stringify(files));
        const destParent = findNode(parentPath, newTree);
        const nodeToAdd = JSON.parse(JSON.stringify(nodeToCopy));
        nodeToAdd.name = newName;
        const finalNode = addRecursively(nodeToAdd, parentPath);
        
        destParent!.children = [...(destParent!.children || []), finalNode];
        setFiles(newTree);

        toast({ title: `Duplicated to "${newName}"` });
    };

    const handlePaste = (destinationPath: string) => {
        if (!clipboard) {
            toast({ variant: 'destructive', title: "Clipboard is empty" });
            return;
        }

        const nodeToMove = findNode(clipboard.path, files);
        if (!nodeToMove) return;

        const destNode = findNode(destinationPath, files);
        if (!destNode || destNode.type !== 'folder') {
            toast({ variant: 'destructive', title: "Invalid paste location" });
            return;
        }

        if (destNode.children?.some(c => c.name === nodeToMove.name)) {
             toast({ variant: 'destructive', title: "A file or folder with this name already exists in the destination." });
             return;
        }
        
        let newFiles = { ...files };
        
        if (clipboard.operation === 'cut') {
            const deleteRecursively = (node: FileSystemNode): FileSystemNode | null => {
                if (node.path === clipboard.path) return null;
                if (node.children) {
                    node.children = node.children.map(child => deleteRecursively(child)).filter(Boolean) as FileSystemNode[];
                }
                return node;
            };
            newFiles = deleteRecursively(newFiles)!;

            if (activeTab.startsWith(clipboard.path)) setActiveTab('');
            setOpenTabs(tabs => tabs.filter(t => !t.startsWith(clipboard.path)));
        }

        const addRecursively = (node: FileSystemNode, basePath: string): FileSystemNode => {
            const newPath = basePath === '/' ? `/${node.name}` : `${basePath}/${node.name}`;
            const newNode = { ...node, path: newPath };
            if (newNode.children) {
                newNode.children = newNode.children.map(child => addRecursively(child, newNode.path));
            }
            return newNode;
        };

        const finalDest = findNode(destinationPath, newFiles);
        if(finalDest && finalDest.children) {
            const nodeToAdd = JSON.parse(JSON.stringify(nodeToMove));
            finalDest.children.push(addRecursively(nodeToAdd, destinationPath));
            // Sort children after adding
            finalDest.children.sort((a, b) => {
              if (a.type === 'folder' && b.type === 'file') return -1;
              if (a.type === 'file' && b.type === 'folder') return 1;
              return a.name.localeCompare(b.name);
            });
        }

        setFiles(newFiles);
        toast({ title: `Pasted "${nodeToMove.name}"` });
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
        initialSettings={settings}
        onSettingsChange={onSettingsChange}
      />
      <CommandPalette isOpen={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} onCommand={executeCommand} />
      <CreateFileModal isOpen={createFileModalOpen} onClose={() => setCreateFileModalOpen(false)} onCreate={(name) => handleCreateFile(name, currentWorkingDirectory)} basePath={currentWorkingDirectory} />
      <CreateFolderModal isOpen={createFolderModalOpen} onClose={() => setCreateFolderModalOpen(false)} onCreate={(name) => handleCreateFolder(name, currentWorkingDirectory)} basePath={currentWorkingDirectory} />
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
                      files={augmentedChallenge.fileSystem}
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
                      files={augmentedChallenge.fileSystem}
                      onCodeChange={handleCodeChange}
                      editorSettings={settings}
                      onContextMenu={onEditorContextMenu}
                      onEditorReady={(editor) => editorInstanceRef.current = editor}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel ref={rightResizablePanelRef} defaultSize={35} minSize={10}>
                  <RightPanel
                      ref={rightPanelRef}
                      testResults={testResults}
                      files={files}
                      handleRunCode={() => handleRunCode()}
                      handleSubmit={() => handleSubmit()}
                      addFile={handleCreateFile}
                      addFolder={addFolder}
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
