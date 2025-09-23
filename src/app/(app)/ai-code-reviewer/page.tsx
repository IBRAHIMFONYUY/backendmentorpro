
'use client';

import { useState, useRef } from 'react';
import { provideRealTimeCodeAssistance, type ProvideRealTimeCodeAssistanceOutput } from '@/ai/flows/provide-real-time-code-assistance';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles, FileCode, Bug, Lightbulb, GraduationCap, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import MonacoEditor from '@monaco-editor/react';

export default function AiCodeReviewerPage() {
    const [code, setCode] = useState('// Paste your code here');
    const [language, setLanguage] = useState('javascript');
    const [description, setDescription] = useState('');
    const [result, setResult] = useState<ProvideRealTimeCodeAssistanceOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleReviewCode = async () => {
        if (!code.trim() || !description.trim()) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please provide both a code snippet and a description of the challenge.',
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await provideRealTimeCodeAssistance({
                codeSnippet: code,
                programmingLanguage: language,
                challengeDescription: description,
            });
            setResult(response);
            toast({
                title: 'Review Complete!',
                description: 'AI has provided feedback on your code.',
            });
        } catch (error) {
            console.error('AI code review error:', error);
            toast({
                variant: 'destructive',
                title: 'Review Failed',
                description: 'Could not get a response from the AI reviewer.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full p-4 md:p-8">
            <header>
                <h1 className="text-3xl font-bold flex items-center gap-3"><FileCode className="text-primary" />AI Code Reviewer</h1>
                <p className="text-muted-foreground mt-1">Get instant feedback, suggestions, and debugging tips from Rahim.</p>
            </header>

            <div className="grid lg:grid-cols-2 gap-8 flex-1">
                <Card className="glass-effect flex flex-col">
                    <CardHeader>
                        <CardTitle>Your Code</CardTitle>
                        <CardDescription>Provide your code and describe the problem you're trying to solve.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Programming Language</label>
                                <Select value={language} onValueChange={setLanguage}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="javascript">JavaScript</SelectItem>
                                        <SelectItem value="python">Python</SelectItem>
                                        <SelectItem value="java">Java</SelectItem>
                                        <SelectItem value="typescript">TypeScript</SelectItem>
                                        <SelectItem value="csharp">C#</SelectItem>
                                        <SelectItem value="go">Go</SelectItem>
                                        <SelectItem value="rust">Rust</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium mb-2">Problem Description or Question</label>
                             <Textarea
                                placeholder="e.g., 'I'm trying to implement a binary search algorithm but it's not working for all cases.'"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="h-24"
                            />
                        </div>
                         <div className="h-[400px]">
                            <label className="block text-sm font-medium mb-2">Code Snippet</label>
                            <MonacoEditor
                                height="100%"
                                language={language}
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || '')}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    wordWrap: 'on',
                                    scrollBeyondLastLine: false,
                                }}
                            />
                        </div>

                        <Button onClick={handleReviewCode} disabled={isLoading} size="lg" className="w-full btn-primary-gradient mt-auto">
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />}
                            Review My Code
                        </Button>
                    </CardContent>
                </Card>

                <Card className="glass-effect">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>AI Feedback</CardTitle>
                        <CardDescription>Rahim's analysis of your code will appear here.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading && (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                            </div>
                        )}
                        {result ? (
                            <div className="space-y-6 text-sm">
                                {result.suggestions && (
                                    <div>
                                        <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><Lightbulb />Suggestions</h3>
                                        <pre className="bg-background/50 p-3 rounded-md whitespace-pre-wrap font-mono">{result.suggestions}</pre>
                                    </div>
                                )}
                                {result.explanation && (
                                    <div>
                                        <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><GraduationCap />Explanation</h3>
                                        <p className="text-muted-foreground leading-relaxed">{result.explanation}</p>
                                    </div>
                                )}
                                <Separator/>
                                {result.debuggingTips && (
                                    <div>
                                        <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><Bug />Debugging Tips</h3>
                                        <p className="text-muted-foreground leading-relaxed">{result.debuggingTips}</p>
                                    </div>
                                )}
                                {result.learningResources && (
                                     <div>
                                        <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><GraduationCap />Learning Resources</h3>
                                        <a href={result.learningResources} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">{result.learningResources}</a>
                                     </div>
                                )}
                            </div>
                        ) : !isLoading && (
                            <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                                <FileCode className="h-12 w-12 mb-4" />
                                <h3 className="text-lg font-semibold">Waiting for code...</h3>
                                <p>Your AI-powered code review will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
