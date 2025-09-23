"use client";

import { useState } from "react";
import { Challenge } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/code-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, CheckCircle, Loader2, XCircle } from "lucide-react";
import { provideRealTimeCodeAssistance, ProvideRealTimeCodeAssistanceOutput } from "@/ai/flows/provide-real-time-code-assistance";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type TestResult = {
  name: string;
  status: 'passed' | 'failed';
  output: string;
};

export function ChallengeView({ challenge }: { challenge: Challenge }) {
  const [code, setCode] = useState(challenge.starterCode);
  const [activeTab, setActiveTab] = useState("tests");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [runOutput, setRunOutput] = useState("Click 'Run Code' to see output.");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [aiHint, setAiHint] = useState<ProvideRealTimeCodeAssistanceOutput | null>(null);

  const { toast } = useToast();

  const handleRunCode = async () => {
    setIsRunning(true);
    setRunOutput("Running code...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async execution
    setRunOutput(`> Simulation complete.\n> No errors found.\n> Output: undefined`);
    setIsRunning(false);
    setActiveTab("output");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTestResults([]);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate async execution
    setTestResults([
      { name: "Test Case 1", status: 'passed', output: "Expected: [0, 1]" },
      { name: "Test Case 2", status: 'passed', output: "Expected: [1, 2]" },
      { name: "Test Case 3", status: 'failed', output: "Expected [1, 3], got [2, 3]" },
      { name: "Test Case 4", status: 'passed', output: "Expected: [0, 4]" },
    ]);
    setIsSubmitting(false);
    setActiveTab("tests");
  };

  const handleGetHint = async () => {
    setIsGettingHint(true);
    setAiHint(null);
    try {
        const result = await provideRealTimeCodeAssistance({
            codeSnippet: code,
            programmingLanguage: "javascript",
            challengeDescription: challenge.description,
        });
        setAiHint(result);
        setActiveTab("ai-mentor");
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error getting hint",
            description: "The AI mentor could not provide a hint. Please try again.",
        });
    }
    setIsGettingHint(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
      {/* Left Panel */}
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{challenge.title}</CardTitle>
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
        </CardHeader>
        <ScrollArea className="flex-grow">
          <CardContent>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: challenge.description.replace(/\n/g, '<br />') }}
            />
          </CardContent>
        </ScrollArea>
      </Card>

      {/* Right Panel */}
      <div className="flex flex-col gap-4 h-full">
        <div className="flex-grow h-1/2">
            <CodeEditor value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <div className="flex-grow flex flex-col h-1/2 min-h-[200px]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="tests">Test Cases</TabsTrigger>
                    <TabsTrigger value="output">Output</TabsTrigger>
                    <TabsTrigger value="ai-mentor">AI Mentor</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="secondary" onClick={handleGetHint} disabled={isGettingHint}>
                        {isGettingHint ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                        Get Hint
                    </Button>
                    <Button variant="outline" onClick={handleRunCode} disabled={isRunning}>
                        {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Run Code
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit
                    </Button>
                </div>
            </div>
            
            <Card className="mt-2 flex-grow">
              <ScrollArea className="h-[calc(100%-1rem)]">
                <CardContent className="py-4">
                  <TabsContent value="tests">
                    {testResults.length === 0 && <p className="text-muted-foreground">Click 'Submit' to run test cases.</p>}
                    <div className="space-y-2">
                        {testResults.map(result => (
                            <div key={result.name} className={`flex items-start p-3 rounded-md border ${result.status === 'passed' ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                                {result.status === 'passed' ? <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" /> : <XCircle className="h-5 w-5 text-red-500 mt-0.5" />}
                                <div className="ml-3">
                                    <p className={`font-semibold ${result.status === 'passed' ? 'text-green-400' : 'text-red-400'}`}>{result.name}: {result.status}</p>
                                    <p className="text-sm text-muted-foreground">{result.output}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="output">
                    <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground">{runOutput}</pre>
                  </TabsContent>
                  <TabsContent value="ai-mentor">
                     {isGettingHint && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /><span>Thinking...</span></div>}
                     {!isGettingHint && !aiHint && <p className="text-muted-foreground">Click 'Get Hint' for AI-powered assistance.</p>}
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
                </CardContent>
              </ScrollArea>
            </Card>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
