
"use client";

import { useState, useEffect, useRef } from "react";
import type { Challenge } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot, CheckCircle, Loader2, XCircle, File, Folder, RefreshCw, ChevronsRight, ChevronsLeft, Play, Paperclip,
  Plus, FolderPlus, Terminal, FlaskConical, TestTube, Share2, Cog, LayoutGrid, Eye, Search, GitBranch, Wifi, Minus, X, Columns, Expand, ArrowLeft, ChevronRight, FileJson, FileText, Check, Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiPlaygroundView } from "./api-playground-view";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { NewProjectModal } from "./ide/new-project-modal";
import { AiAssistantModal } from "./ai-assistant-modal";
import Link from "next/link";
import { Progress } from "./ui/progress";

type TestResult = {
  name: string;
  status: 'passed' | 'failed' | 'pending' | 'running';
  output: string;
};

type FileSystemNode = {
  type: 'file' | 'folder';
  name: string;
  path: string;
  content?: string;
  children?: FileSystemNode[];
};

const initialFiles: FileSystemNode = { 
  name: 'rest-api-auth', type: 'folder', path: 'rest-api-auth', children: [
    { name: '.env', type: 'file', path: 'rest-api-auth/.env', content: 'JWT_SECRET=your-secret-key' },
    { name: 'package.json', type: 'file', path: 'rest-api-auth/package.json', content: '{ "name": "rest-api-auth" }' },
    { name: 'README.md', type: 'file', path: 'rest-api-auth/README.md', content: '# REST API Auth Challenge' },
    { name: 'server.js', type: 'file', path: 'rest-api-auth/server.js', content: `console.log('hello')` },
  ]
};

const initialTestResults: TestResult[] = [
    { name: "Basic server setup", status: 'passed', output: "Completed" },
    { name: "JWT implementation", status: 'passed', output: "Completed" },
    { name: "Login endpoint", status: 'passed', output: "Completed" },
    { name: "Protected routes", status: 'failed', output: "Pending implementation" },
    { name: "Error handling", status: 'pending', output: "Not started" },
];


export function CodeIdeView({ challenge }: { challenge: Challenge }) {
  const [code, setCode] = useState(challenge.starterCode);
  const [activeTab, setActiveTab] = useState("server.js");
  const [rightPanelTab, setRightPanelTab] = useState('output');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>(initialTestResults);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState([
    {type: 'output', content: 'Welcome to Backend Mentor Terminal'},
    {type: 'output', content: "Type 'help' for available commands"},
    {type: 'ai', content: '[AI] Rahim is ready to assist you!'},
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const { toast } = useToast();
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleTerminalCommand = (command: string) => {
    const newOutput = [...terminalOutput, {type: 'command', content: `/ ${command}`}];
    
    // Simulate command execution
    if (command.toLowerCase() === 'help') {
      newOutput.push({type: 'output', content: 'Available commands: ls, clear, test'});
    } else if (command.toLowerCase() === 'clear') {
      setTerminalOutput([]);
      return;
    } else if (command.toLowerCase() === 'test') {
        newOutput.push({type: 'output', content: 'Running tests...'});
        handleSubmit();
    } else if (command.toLowerCase() === 'ls') {
        newOutput.push({type: 'output', content: initialFiles.children?.map(f => f.name).join('  ') || ''});
    }
    else {
       newOutput.push({type: 'error', content: `Command not found: ${command}`});
    }

    setTerminalOutput(newOutput);
    setTerminalInput('');
  };


  const handleRunCode = async () => {
    setIsRunning(true);
    setRightPanelTab("output");
    setTerminalOutput(prev => [...prev, {type: 'command', content: '$ node server.js'}]);
    await new Promise(resolve => setTimeout(resolve, 500));
    setTerminalOutput(prev => [...prev, {type: 'output', content: 'hello'}]);
    await new Promise(resolve => setTimeout(resolve, 200));
    setTerminalOutput(prev => [...prev, {type: 'success', content: 'Execution finished.'}]);
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setRightPanelTab("tests");
    toast({ title: "Submitting solution", description: "Running all test cases..." });

    // Reset tests to running
    setTestResults(prev => prev.map(t => ({...t, status: 'running'})));

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Final test results
    setTestResults([
      { name: "Basic server setup", status: 'passed', output: "Completed" },
      { name: "JWT implementation", status: 'passed', output: "Completed" },
      { name: "Login endpoint", status: 'passed', output: "Completed" },
      { name: "Protected routes", status: 'passed', output: "Completed" },
      { name: "Error handling", status: 'failed', output: "Missing error handling for expired tokens" },
    ]);
    setIsSubmitting(false);
    toast({ title: "Tests finished", description: "4 out of 5 tests passed." });
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.js')) return <FileJson className="h-4 w-4 text-yellow-400" />;
    if (filename.endsWith('.json')) return <FileJson className="h-4 w-4 text-green-400" />;
    if (filename.endsWith('.md')) return <FileText className="h-4 w-4 text-blue-400" />;
    return <File className="h-4 w-4 text-muted-foreground" />;
  }
  
  const FileTree = ({ node, level = 0 }: { node: FileSystemNode, level?: number }) => (
    <div className="space-y-1">
      <div className="flex items-center space-x-2 p-1 rounded-md hover:bg-muted cursor-pointer" style={{ paddingLeft: `${level * 1}rem` }}>
        {node.type === 'folder' ? <Folder className="h-4 w-4 text-blue-400" /> : getFileIcon(node.name)}
        <span className="text-sm">{node.name}</span>
      </div>
      {node.type === 'folder' && node.children && (
        <div className="pl-2">
          {node.children.map(child => <FileTree key={child.path} node={child} level={level + 1} />)}
        </div>
      )}
    </div>
  );

  const passedTests = testResults.filter(r => r.status === 'passed').length;
  const totalTests = testResults.length;
  const progressValue = (passedTests / totalTests) * 100;

  return (
    <>
    <AiAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />

    <div className="h-screen w-full flex flex-col bg-[#0d1117] text-gray-300 font-mono text-sm">
      {/* Top Bar */}
      <div className="h-10 bg-[#161b22] border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/dashboard"><ArrowLeft className="h-5 w-5 text-gray-400 hover:text-white" /></Link>
          <span className="text-gray-400">Backend Mentor</span>
          <ChevronRight className="h-4 w-4 text-gray-600" />
          <span className="text-white font-medium">rest-api-auth</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Auto-save enabled</span>
          </div>
          <span>11:43</span>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setAiModalOpen(true)} title="AI Assistant"><Bot className="h-5 w-5"/></Button>
            <Button variant="ghost" size="icon" title="Share Session"><Share2 className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" title="Settings"><Cog className="h-5 w-5" /></Button>
            <Button onClick={handleRunCode} disabled={isRunning} variant="ghost" className="bg-green-600 text-white hover:bg-green-700 h-8 px-4">
                {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />} Run
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} size="sm" className="bg-blue-600 text-white hover:bg-blue-700 h-8 px-4">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Submit
            </Button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={18} minSize={15} maxSize={30}>
                <div className="flex flex-col h-full bg-[#161b22] text-gray-400">
                    <div className="p-3 border-b border-border flex items-center justify-between">
                        <h3 className="text-xs font-bold tracking-wider uppercase">Explorer</h3>
                        <div className="flex gap-2">
                            <button title="New File" className="hover:text-white"><File className="h-4 w-4" /></button>
                            <button title="New Folder" className="hover:text-white"><FolderPlus className="h-4 w-4" /></button>
                            <button title="Refresh" className="hover:text-white"><RefreshCw className="h-4 w-4" /></button>
                        </div>
                    </div>
                    <ScrollArea className="flex-grow p-2">
                       <FileTree node={initialFiles} />
                    </ScrollArea>
                    <div className="p-3 border-t border-border">
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
                              <span className={result.status === 'failed' ? 'text-red-400' : ''}>{result.name}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
          
          <ResizablePanel className="flex-1 flex flex-col">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={65} minSize={25} className="relative flex flex-col">
                 <div className="h-10 bg-[#0d1117] border-b border-border flex items-center">
                    <div className={`px-4 py-2 text-sm flex items-center gap-2 border-r border-border cursor-pointer bg-[#161b22]`}>
                      {getFileIcon('server.js')}
                      <span>server.js</span>
                      <X className="h-4 w-4 hover:text-white"/>
                    </div>
                 </div>
                 <div className="flex-1 relative">
                  <CodeEditor value={code} onChange={(e) => setCode(e.target.value)} className="bg-[#0d1117] border-none"/>
                 </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={35} minSize={20}>
                <div className="h-full flex flex-col bg-[#161b22]">
                  <div className="flex items-center px-2 border-b border-border h-10 shrink-0">
                      <button onClick={() => setRightPanelTab('output')} className={`px-4 py-2 text-sm flex items-center gap-2 ${rightPanelTab === 'output' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}><Terminal className="h-4 w-4"/>Output</button>
                      <button onClick={() => setRightPanelTab('api')} className={`px-4 py-2 text-sm flex items-center gap-2 ${rightPanelTab === 'api' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}><FlaskConical className="h-4 w-4"/>API Test</button>
                      <button onClick={() => setRightPanelTab('tests')} className={`px-4 py-2 text-sm flex items-center gap-2 ${rightPanelTab === 'tests' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'}`}><TestTube className="h-4 w-4"/>Tests</button>
                  </div>
                    
                    <div className="flex-grow overflow-y-auto">
                        <div className="p-4 h-full">
                          {rightPanelTab === 'tests' && (
                            <div className="space-y-2">
                                {testResults.map(result => (
                                    <div key={result.name} className={`flex items-start p-2 rounded-md border ${result.status === 'passed' ? 'border-green-500/20 bg-green-500/10' : result.status === 'failed' ? 'border-red-500/20 bg-red-500/10' : 'border-yellow-500/20 bg-yellow-500/10'}`}>
                                        {result.status === 'passed' ? <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" /> : result.status === 'failed' ? <XCircle className="h-5 w-5 text-red-500 mt-0.5" /> : <Loader2 className="h-5 w-5 text-yellow-500 mt-0.5 animate-spin"/>}
                                        <div className="ml-3">
                                            <p className={`font-medium text-sm ${result.status === 'passed' ? 'text-green-400' : result.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>{result.name}: {result.status}</p>
                                            <p className="text-xs text-muted-foreground">{result.output}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                          )}
                           {rightPanelTab === 'output' && (
                             <div className="h-full flex flex-col">
                                <div className="p-2 border-b border-border text-xs flex justify-between items-center">
                                  <span>Terminal</span>
                                  <div className="flex items-center gap-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                  </div>
                                </div>
                                <div ref={terminalRef} className="flex-1 terminal p-2 font-mono text-xs">
                                  {terminalOutput.map((line, index) => (
                                    <div key={index} className={line.type === 'command' ? 'text-gray-400' : line.type === 'error' ? 'text-red-400' : 'text-green-400'}>
                                      {line.type === 'ai' ? <span className="text-purple-400">{line.content}</span> : line.content}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex bg-[#0d1117] p-1">
                                    <span className="text-green-400">/</span>
                                    <input
                                      type="text"
                                      value={terminalInput}
                                      onChange={(e) => setTerminalInput(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleTerminalCommand(terminalInput);
                                      }}
                                      className="terminal-input ml-2"
                                      placeholder="Type command..."
                                    />
                                  </div>
                             </div>
                          )}
                          {rightPanelTab === 'api' && (
                            <div className="h-full">
                              <ApiPlaygroundView />
                            </div>
                          )}
                        </div>
                    </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-4 text-xs shrink-0">
          <div className="flex items-center gap-4">
              <span>Ln 1, Col 18</span>
              <span>Javascript</span>
              <span>UTF-8</span>
              <span>19 Bytes</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1"><Wifi /><span>Connected</span></div>
            <div className="flex items-center gap-1"><GitBranch /><span>main</span></div>
            <div className="flex items-center gap-1"><Bot /><span>Rahim Ready</span></div>
            <span>Backend Mentor</span>
          </div>
      </div>
    </div>
    </>
  );
}
