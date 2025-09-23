
"use client";

import { useState, useEffect, useRef } from "react";
import type { Challenge } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot, CheckCircle, Loader2, XCircle, File, Folder, RefreshCw, ChevronsRight, ChevronsLeft, Play, Paperclip,
  Plus, FolderPlus, Terminal, FlaskConical, TestTube, Share2, Cog, LayoutGrid, Eye, Search, GitBranch, Wifi, Minus, X, Columns, Expand
} from "lucide-react";
import { provideRealTimeCodeAssistance, ProvideRealTimeCodeAssistanceOutput } from "@/ai/flows/provide-real-time-code-assistance";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ApiPlaygroundView } from "./api-playground-view";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { NewProjectModal } from "./ide/new-project-modal";
import { AiAssistantModal } from "./ai-assistant-modal";

type TestResult = {
  name: string;
  status: 'passed' | 'failed' | 'pending';
  output: string;
};

type FileSystemNode = {
  type: 'file' | 'folder';
  name: string;
  content?: string;
  children?: { [key: string]: FileSystemNode };
};


export function CodeIdeView({ challenge }: { challenge: Challenge }) {
  const [code, setCode] = useState(challenge.starterCode);
  const [activeTab, setActiveTab] = useState("challenge");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [runOutput, setRunOutput] = useState("Click 'Run Code' to see output.");
  const [testResults, setTestResults] = useState<TestResult[]>([
      { name: "Test Case 1", status: 'pending', output: "Pending" },
      { name: "Test Case 2", status: 'pending', output: "Pending" },
      { name: "Test Case 3", status: 'pending', output: "Pending" },
      { name: "Test Case 4", status: 'pending', output: "Pending" },
  ]);
  const [aiHint, setAiHint] = useState<ProvideRealTimeCodeAssistanceOutput | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [rightPanel, setRightPanel] = useState('output');
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([
    {type: 'info', content: 'Welcome to Backend Mentor Terminal'},
    {type: 'info', content: "Type 'help' for available commands"},
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleTerminalCommand = (command: string) => {
    setTerminalOutput(prev => [...prev, {type: 'command', content: `$ ${command}`}]);
    
    // Simulate command execution
    if (command.startsWith('echo')) {
      const message = command.substring(5);
      setTerminalOutput(prev => [...prev, {type: 'output', content: message}]);
    } else if (command === 'clear') {
      setTerminalOutput([]);
    } else {
       setTerminalOutput(prev => [...prev, {type: 'error', content: `Command not found: ${command}`}]);
    }

    setTerminalInput('');
  };


  const handleRunCode = async () => {
    setIsRunning(true);
    setRunOutput("Running code...");
    setRightPanel("output");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async execution
    setRunOutput(`> Simulation complete.\n> No errors found.\n> Output: undefined`);
    setIsRunning(false);
    toast({ title: "Code executed", description: "Check the output panel for results." });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTestResults(prev => prev.map(t => ({...t, status: 'pending'})));
    setRightPanel("tests");
    toast({ title: "Submitting solution", description: "Running all test cases..." });

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate async execution
    setTestResults([
      { name: "Test Case 1", status: 'passed', output: "Expected: [0, 1]" },
      { name: "Test Case 2", status: 'passed', output: "Expected: [1, 2]" },
      { name: "Test Case 3", status: 'failed', output: "Expected [1, 3], got [2, 3]" },
      { name: "Test Case 4", status: 'passed', output: "Expected: [0, 4]" },
    ]);
    setIsSubmitting(false);
    toast({ title: "Tests finished", description: "3 out of 4 tests passed." });
  };

  const handleGetHint = async () => {
    setIsGettingHint(true);
    setAiHint(null);
    setRightPanel("ai-mentor");
    try {
        const result = await provideRealTimeCodeAssistance({
            codeSnippet: code,
            programmingLanguage: "javascript",
            challengeDescription: challenge.description,
        });
        setAiHint(result);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error getting hint",
            description: "The AI mentor could not provide a hint. Please try again.",
        });
    }
    setIsGettingHint(false);
  };
  
  const files: FileSystemNode = { 
    name: 'src', type: 'folder', children: {
      'index.js': { name: 'index.js', type: 'file', content: challenge.starterCode },
      'utils.js': { name: 'utils.js', type: 'file', content: '// Utility functions' },
      'package.json': { name: 'package.json', type: 'file', content: '{ "name": "challenge" }' },
      'README.md': { name: 'README.md', type: 'file', content: challenge.description },
    }
  };
  
  const FileTree = ({ node, path }: { node: FileSystemNode, path: string }) => (
    <div className="space-y-1">
      {Object.values(node.children || {}).map(child => {
        const currentPath = `${path}/${child.name}`;
        return (
          <div key={currentPath}>
            <div className="flex items-center space-x-2 p-1 rounded-md hover:bg-muted cursor-pointer">
              {child.type === 'folder' ? <Folder className="h-4 w-4 text-primary" /> : <File className="h-4 w-4 text-muted-foreground" />}
              <span className="text-sm">{child.name}</span>
            </div>
            {child.type === 'folder' && child.children && (
              <div className="pl-4 border-l border-border ml-2">
                <FileTree node={child} path={currentPath} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  );


  return (
    <>
    <NewProjectModal isOpen={newProjectModalOpen} onClose={() => setNewProjectModalOpen(false)} />
    <AiAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />

    <div className="h-full w-full flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 bg-card/80 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Toggle Sidebar">
            {isSidebarOpen ? <ChevronsLeft /> : <ChevronsRight />}
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{challenge.title}</span>
              <span className="text-border">/</span>
              <span className="text-foreground">server.js</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Auto-save on</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setAiModalOpen(true)} title="AI Assistant"><Bot /></Button>
            <Button variant="ghost" size="icon" title="Share Session"><Share2 /></Button>
            <Button variant="ghost" size="icon" title="Settings"><Cog /></Button>
            <Button onClick={handleRunCode} disabled={isRunning} variant="outline" size="sm">
                {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />} Run
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} size="sm" className="btn-primary-gradient">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
            </Button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
            {isSidebarOpen && (
              <>
                <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
                    <div className="flex flex-col h-full bg-card/50">
                        <div className="p-3 border-b border-border">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">EXPLORER</h3>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-6 w-6" title="New File" onClick={() => toast({title: "New File clicked"})}><File /></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" title="New Folder" onClick={() => toast({title: "New Folder clicked"})}><FolderPlus /></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" title="Refresh" onClick={() => toast({title: "Refresh clicked"})}><RefreshCw /></Button>
                                </div>
                            </div>
                        </div>
                        <ScrollArea className="flex-grow p-2">
                           <FileTree node={files} path="" />
                        </ScrollArea>
                        <div className="p-3 border-t border-border">
                          <div className="text-xs text-muted-foreground mb-2 flex justify-between">
                            <span>Progress</span>
                            <span>{testResults.filter(r => r.status === 'passed').length}/{testResults.length} tests</span>
                          </div>
                           <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{width: `${(testResults.filter(r => r.status === 'passed').length / testResults.length) * 100}%`}}></div>
                          </div>
                        </div>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}
          
          <ResizablePanel className="flex-1 flex flex-col">
            {/* Main Content Area */}
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={60} minSize={25} className="relative">
                 <CodeEditor value={code} onChange={(e) => setCode(e.target.value)} />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40} minSize={20}>
                <div className="h-full flex flex-col bg-card/50">
                  <div className="flex items-center px-2 border-b border-border h-10">
                      <button onClick={() => setRightPanel('challenge')} className={`px-4 py-2 text-sm flex items-center gap-2 ${rightPanel === 'challenge' ? 'tab-active text-foreground' : 'text-muted-foreground'}`}><LayoutGrid className="h-4 w-4"/>Challenge</button>
                      <button onClick={() => setRightPanel('output')} className={`px-4 py-2 text-sm flex items-center gap-2 ${rightPanel === 'output' ? 'tab-active text-foreground' : 'text-muted-foreground'}`}><Terminal className="h-4 w-4"/>Output</button>
                      <button onClick={() => setRightPanel('tests')} className={`px-4 py-2 text-sm flex items-center gap-2 ${rightPanel === 'tests' ? 'tab-active text-foreground' : 'text-muted-foreground'}`}><TestTube className="h-4 w-4"/>Tests</button>
                      <button onClick={() => setRightPanel('api')} className={`px-4 py-2 text-sm flex items-center gap-2 ${rightPanel === 'api' ? 'tab-active text-foreground' : 'text-muted-foreground'}`}><FlaskConical className="h-4 w-4"/>API Test</button>
                  </div>
                    
                    <ScrollArea className="flex-grow">
                        <div className="p-4">
                          {rightPanel === 'challenge' && (
                            <div
                              className="prose prose-invert max-w-none prose-sm"
                              dangerouslySetInnerHTML={{ __html: challenge.description.replace(/\n/g, '<br />') }}
                            />
                          )}
                          {rightPanel === 'tests' && (
                            <div className="space-y-2">
                                {testResults.map(result => (
                                    <div key={result.name} className={`flex items-start p-3 rounded-md border ${result.status === 'passed' ? 'border-green-500/30 bg-green-500/10' : result.status === 'failed' ? 'border-red-500/30 bg-red-500/10' : 'border-yellow-500/30 bg-yellow-500/10'}`}>
                                        {result.status === 'passed' ? <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" /> : result.status === 'failed' ? <XCircle className="h-5 w-5 text-red-500 mt-0.5" /> : <Loader2 className="h-5 w-5 text-yellow-500 mt-0.5 animate-spin"/>}
                                        <div className="ml-3">
                                            <p className={`font-semibold ${result.status === 'passed' ? 'test-passed' : result.status === 'failed' ? 'test-failed' : 'test-pending'}`}>{result.name}: {result.status}</p>
                                            <p className="text-sm text-muted-foreground">{result.output}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                          )}
                           {rightPanel === 'output' && (
                            <div ref={terminalRef} className="h-full terminal p-4 font-mono text-sm">
                              {terminalOutput.map((line, index) => (
                                <div key={index} className={line.type === 'command' ? 'text-primary' : line.type === 'error' ? 'text-red-400' : 'text-green-400'}>
                                  {line.content}
                                </div>
                              ))}
                              <div className="flex">
                                <span className="text-green-400">$ &nbsp;</span>
                                <input
                                  type="text"
                                  value={terminalInput}
                                  onChange={(e) => setTerminalInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleTerminalCommand(terminalInput);
                                  }}
                                  className="terminal-input"
                                />
                              </div>
                            </div>
                          )}
                          {rightPanel === 'api' && (
                            <div className="h-[500px]">
                              <ApiPlaygroundView />
                            </div>
                          )}
                        </div>
                    </ScrollArea>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-4 text-xs">
          <div className="flex items-center gap-4">
              <span>Ln 1, Col 1</span>
              <span>Spaces: 4</span>
              <span>UTF-8</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1"><GitBranch /><span>main</span></div>
            <div className="flex items-center gap-1"><Wifi /><span>Connected</span></div>
            <span>BackendMentorAI</span>
          </div>
      </div>
    </div>
    </>
  );
}
