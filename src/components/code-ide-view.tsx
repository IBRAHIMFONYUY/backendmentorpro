"use client";

import { useState, useEffect } from "react";
import { Challenge } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot, CheckCircle, Loader2, XCircle, File, Folder, RefreshCw, ChevronsRight, ChevronsLeft, Play, Paperclip,
  Plus, FolderPlus, Terminal, FlaskConical, TestTube, Share2, Cog, LayoutGrid, Eye, Search
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

export function CodeIdeView({ challenge }: { challenge: Challenge }) {
  const [code, setCode] = useState(challenge.starterCode);
  const [activeTab, setActiveTab] = useState("tests");
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


  const { toast } = useToast();

  const handleRunCode = async () => {
    setIsRunning(true);
    setRunOutput("Running code...");
    setActiveTab("output");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async execution
    setRunOutput(`> Simulation complete.\n> No errors found.\n> Output: undefined`);
    setIsRunning(false);
    toast({ title: "Code executed", description: "Check the output panel for results." });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTestResults(prev => prev.map(t => ({...t, status: 'pending'})));
    setActiveTab("tests");
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
    setActiveTab("ai-mentor");
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
  
  const files = [
    { name: 'src', type: 'folder', children: [
        { name: 'index.js', type: 'file' },
        { name: 'utils.js', type: 'file' },
    ]},
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' },
  ]
  
  const FileTree = ({ items }: { items: any[] }) => (
    <div className="space-y-1">
      {items.map(item => (
        <div key={item.name}>
          <div className="flex items-center space-x-2 p-1 rounded-md hover:bg-muted cursor-pointer">
            {item.type === 'folder' ? <Folder className="h-4 w-4 text-primary" /> : <File className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm">{item.name}</span>
          </div>
          {item.children && (
            <div className="pl-4 border-l border-border ml-2">
              <FileTree items={item.children} />
            </div>
          )}
        </div>
      ))}
    </div>
  );


  return (
    <>
    <NewProjectModal isOpen={newProjectModalOpen} onClose={() => setNewProjectModalOpen(false)} />
    <AiAssistantModal isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)} />

    <div className="h-full w-full flex flex-col bg-card glass-effect rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <ChevronsLeft /> : <ChevronsRight />}
            </Button>
             <Button variant="ghost" size="icon" onClick={() => setNewProjectModalOpen(true)}>
                <Plus />
            </Button>
            <span className="text-sm font-medium">{challenge.title}</span>
            <Badge
              variant={
                challenge.difficulty === "Easy" ? "secondary"
                : challenge.difficulty === "Medium" ? "default"
                : "destructive"
              }
            >
              {challenge.difficulty}
            </Badge>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setAiModalOpen(true)}><Bot /></Button>
            <Button variant="ghost" size="icon"><Share2 /></Button>
            <Button variant="ghost" size="icon"><Cog /></Button>
            <Button onClick={handleRunCode} disabled={isRunning} size="sm" variant="outline">
                {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />} Run
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} size="sm" className="btn-primary-gradient">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
            </Button>
        </div>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
          {isSidebarOpen && (
              <>
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                    <div className="flex flex-col h-full">
                        <div className="p-2 border-b">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold">Explorer</h3>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-6 w-6"><File /></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6"><FolderPlus /></Button>
                                    <Button variant="ghost" size="icon" className="h-6 w-6"><RefreshCw /></Button>
                                </div>
                            </div>
                        </div>
                        <ScrollArea className="flex-grow p-2">
                           <FileTree items={files} />
                        </ScrollArea>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
          )}
          
          <ResizablePanel>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={60} minSize={25}>
                 <CodeEditor value={code} onChange={(e) => setCode(e.target.value)} />
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={40} minSize={20}>
                <div className="h-full flex flex-col">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                    <div className="flex items-center px-2 border-b">
                        <TabsList>
                            <TabsTrigger value="challenge"><LayoutGrid className="mr-2 h-4 w-4"/>Challenge</TabsTrigger>
                            <TabsTrigger value="output"><Terminal className="mr-2 h-4 w-4"/>Output</TabsTrigger>
                            <TabsTrigger value="tests"><TestTube className="mr-2 h-4 w-4"/>Tests</TabsTrigger>
                            <TabsTrigger value="api"><FlaskConical className="mr-2 h-4 w-4"/>API Test</TabsTrigger>
                            <TabsTrigger value="ai-mentor"><Bot className="mr-2 h-4 w-4"/>AI Mentor</TabsTrigger>
                        </TabsList>
                         <div className="ml-auto flex items-center gap-2">
                            <Button variant="ghost" onClick={handleGetHint} disabled={isGettingHint}>
                                {isGettingHint ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                                Ask AI
                            </Button>
                        </div>
                    </div>
                    
                    <ScrollArea className="flex-grow">
                        <div className="p-4">
                          <TabsContent value="challenge">
                            <div
                              className="prose prose-invert max-w-none prose-sm"
                              dangerouslySetInnerHTML={{ __html: challenge.description.replace(/\n/g, '<br />') }}
                            />
                          </TabsContent>
                          <TabsContent value="tests">
                            {testResults.length === 0 && <p className="text-muted-foreground">Click 'Submit' to run test cases.</p>}
                            <div className="space-y-2">
                                {testResults.map(result => (
                                    <div key={result.name} className={`flex items-start p-3 rounded-md border ${result.status === 'passed' ? 'border-green-500/30 bg-green-500/10' : result.status === 'failed' ? 'border-red-500/30 bg-red-500/10' : 'border-yellow-500/30 bg-yellow-500/10'}`}>
                                        {result.status === 'passed' ? <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" /> : result.status === 'failed' ? <XCircle className="h-5 w-5 text-red-500 mt-0.5" /> : <Loader2 className="h-5 w-5 text-yellow-500 mt-0.5 animate-spin"/>}
                                        <div className="ml-3">
                                            <p className={`font-semibold ${result.status === 'passed' ? 'text-green-400' : result.status === 'failed' ? 'text-red-400' : 'text-yellow-400'}`}>{result.name}: {result.status}</p>
                                            <p className="text-sm text-muted-foreground">{result.output}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="output">
                            <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground">{runOutput}</pre>
                          </TabsContent>
                          <TabsContent value="api" className="h-full">
                            <ApiPlaygroundView />
                          </TabsContent>
                          <TabsContent value="ai-mentor">
                             {isGettingHint && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /><span>Thinking...</span></div>}
                             {!isGettingHint && !aiHint && <p className="text-muted-foreground">Click 'Ask AI' for AI-powered assistance.</p>}
                             {aiHint && (
                                <div className="space-y-4">
                                    <Alert>
                                        <Bot className="h-4 w-4" />
                                        <AlertTitle>Suggestions</AlertTitle>
                                        <AlertDescription>
                                            <p className="whitespace-pre-wrap">{aiHint.suggestions}</p>
                                        </AlertDescription>
                                    </Alert>
                                     <Alert>
                                        <Bot className="h-4 w-4" />
                                        <AlertTitle>Explanation</AlertTitle>
                                        <AlertDescription>
                                            <p className="whitespace-pre-wrap">{aiHint.explanation}</p>
                                        </AlertDescription>
                                    </Alert>
                                     {aiHint.debuggingTips && (
                                        <Alert variant="destructive">
                                            <Bot className="h-4 w-4" />
                                            <AlertTitle>Debugging Tips</AlertTitle>
                                            <AlertDescription>
                                                <p className="whitespace-pre-wrap">{aiHint.debuggingTips}</p>
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                             )}
                          </TabsContent>
                        </div>
                    </ScrollArea>
                  </Tabs>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
      </ResizablePanelGroup>
    </div>
    </>
  );
}
