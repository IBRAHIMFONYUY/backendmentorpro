
"use client";

import { useState, useEffect, useRef } from "react";
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

export function CodeIdeView({ challenge }: { challenge: Challenge }) {
  const [files, setFiles] = useState<FileSystemNode>(initialFiles);
  const [openTabs, setOpenTabs] = useState<string[]>(['rest-api-auth/server.js']);
  const [activeTab, setActiveTab] = useState('rest-api-auth/server.js');
  const [testResults, setTestResults] = useState<TestResult[]>(initialTestResults);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
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
    setTerminalOutput(prev => [...prev, {type: 'command', content: `$ node ${activeTab}`}]);
    await new Promise(resolve => setTimeout(resolve, 500));
    setTerminalOutput(prev => [...prev, {type: 'output', content: activeFileContent.split('\n')[1] || 'No output'}]);
    await new Promise(resolve => setTimeout(resolve, 200));
    setTerminalOutput(prev => [...prev, {type: 'success', content: 'Execution finished.'}]);
    setIsRunning(false);
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

  const handleCloseTab = (path: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const newTabs = openTabs.filter(t => t !== path);
      setOpenTabs(newTabs);
      if (activeTab === path) {
          setActiveTab(newTabs[0] || '');
      }
  }

  return (
    <>
    <AiAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />
    <NewProjectModal isOpen={newProjectModalOpen} onClose={() => setNewProjectModalOpen(false)} />

    <div className="h-screen w-full flex flex-col bg-[#020617] text-gray-300 font-mono text-sm">
      <IdeTopBar 
        challenge={challenge}
        onNewProject={() => setNewProjectModalOpen(true)}
        onAiClick={() => setAiModalOpen(true)}
        onRunCode={(...args) => handleRunCode(...args)}
        onSubmit={(...args) => handleSubmit(...args)}
        isRunning={isRunning}
        isSubmitting={isSubmitting}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={18} minSize={15} maxSize={30}>
                <FileExplorer
                    files={files}
                    activeTab={activeTab}
                    openTabs={openTabs}
                    setOpenTabs={setOpenTabs}
                    setActiveTab={setActiveTab}
                    testResults={testResults}
                />
            </ResizablePanel>
            <ResizableHandle withHandle />
          
          <ResizablePanel className="flex-1 flex flex-col">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={65} minSize={25} className="relative flex flex-col">
                <EditorPanel
                    openTabs={openTabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    handleCloseTab={handleCloseTab}
                    activeFileContent={activeFileContent}
                    onCodeChange={handleCodeChange}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={35} minSize={20}>
                <RightPanel
                    testResults={testResults}
                    files={files}
                    onRunCode={(...args) => handleRunCode(...args)}
                    onSubmit={(...args) => handleSubmit(...args)}
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
