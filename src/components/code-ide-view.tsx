
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
import { SettingsModal } from "./ide/settings-modal";
import { CommandPalette } from "./ide/command-palette";

export function CodeIdeView({ challenge }: { challenge: Challenge }) {
  const [files, setFiles] = useState<FileSystemNode>(initialFiles);
  const [openTabs, setOpenTabs] = useState<string[]>(['/server.js']);
  const [activeTab, setActiveTab] = useState('/server.js');
  const [testResults, setTestResults] = useState<TestResult[]>(initialTestResults);
  
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  const findNode = (path: string, node: FileSystemNode): FileSystemNode | null => {
      if (node.path === path) return node;
      if (node.children) {
          for (const child of node.children) {
              const found = findNode(path, child);
              if (found) return found;
          }
      }
      return null;
  }
  
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
    if (!openTabs.includes(path)) {
      setOpenTabs(prev => [...prev, path]);
    }
    setActiveTab(path);
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
      // Add more command executions here
      default:
        toast({ title: "Command not recognized", variant: "destructive" });
    }
    setCommandPaletteOpen(false);
  }
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setCommandPaletteOpen(v => !v);
      }
       if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setSettingsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dummy ref for now, will connect to editor later
  const editorRef = { current: null }; 
  const onSettingsChange = (settings: any) => {
    console.log("Settings changed:", settings);
    // Here you would apply settings to the Monaco editor instance
    // For example: editorRef.current?.updateOptions({ fontSize: settings.fontSize });
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

      <div className="h-screen w-screen flex flex-col bg-background ide-body">
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

    