"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bot, Bug, Lightbulb, Loader2, Wrench } from "lucide-react";
import { generateDebuggingAssistance, type GenerateDebuggingAssistanceOutput } from "@/ai/flows/generate-debugging-assistance";
import { useToast } from "@/hooks/use-toast";

const placeholderCode = `function buggyFunction(arr) {
  for (let i = 0; i <= arr.length; i++) {
    console.log(arr[i]);
  }
}

buggyFunction([1, 2, 3]);`;

export function DebuggerView() {
  const [code, setCode] = useState(placeholderCode);
  const [language, setLanguage] = useState("javascript");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateDebuggingAssistanceOutput | null>(null);
  const { toast } = useToast();

  const handleDebug = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateDebuggingAssistance({ code, language });
      setResult(response);
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error during debugging",
        description: "The AI debugger encountered an issue. Please try again.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Code Input</CardTitle>
          <CardDescription>
            Paste your code snippet below, select the language, and let the AI find the bugs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
            </SelectContent>
          </Select>
          <div className="h-96">
            <CodeEditor value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <Button onClick={handleDebug} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bug className="mr-2 h-4 w-4" />}
            Debug Code
          </Button>
        </CardContent>
      </Card>
      
      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot /> AI Analysis
          </CardTitle>
          <CardDescription>
            The AI's findings will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {result ? (
            <div className="space-y-4">
              <Alert>
                <Bug className="h-4 w-4" />
                <AlertTitle>Error Identification</AlertTitle>
                <AlertDescription>{result.errorIdentification}</AlertDescription>
              </Alert>
              <Alert>
                <Wrench className="h-4 w-4" />
                <AlertTitle>Suggested Fixes</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap font-mono text-xs">{result.suggestedFixes}</AlertDescription>
              </Alert>
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Root Cause Explanation</AlertTitle>
                <AlertDescription>{result.rootCauseExplanation}</AlertDescription>
              </Alert>
            </div>
          ) : (
            !isLoading && (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                <p>Ready to find some bugs!</p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
